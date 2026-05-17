import { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';

const TABS = ['All', 'Product', 'Web', 'UX', 'UI', 'Brand'];

const DROPDOWNS = [
  { id: 'discipline', label: 'Discipline', options: ['Product Design', 'Visual Design', 'Motion', 'Illustration'] },
  { id: 'role',       label: 'Role',       options: ['Junior', 'Mid', 'Senior', 'Lead', 'Director'], badge: 2 },
  { id: 'style',      label: 'Style',      options: ['Minimal', 'Bold', 'Editorial', 'Playful'] },
  { id: 'platform',   label: 'Platform',   options: ['Web', 'iOS', 'Android', 'Desktop'] },
];

const PORTFOLIOS = Array.from({ length: 8 }, (_, i) => ({ id: i, author: 'Designer Name' }));

function Dropdown({ dropdown, isOpen, onToggle }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onToggle(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onToggle]);

  return (
    <div className="dropdown-wrap" ref={ref}>
      <button
        className={`btn-dropdown${isOpen ? ' dropdown-open' : ''}`}
        onClick={() => onToggle(isOpen ? null : dropdown.id)}
        aria-expanded={isOpen}
      >
        {dropdown.label}{dropdown.badge ? ` (${dropdown.badge})` : ''} <span className="chevron" aria-hidden="true">▾</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu" role="menu">
          {dropdown.options.map(opt => (
            <button key={opt} className="dropdown-item" role="menuitem" onClick={() => onToggle(null)}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab]       = useState('All');
  const [chips, setChips]               = useState(['Senior', 'Lead']);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="page">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon" aria-hidden="true" />
          <span className="logo-text">Best Portfolio Websites</span>
        </div>
        <a href="#signup" className="btn btn-secondary">Get inspired →</a>
      </nav>

      {/* ── Hero ── */}
      <m.section
        className="hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1>Get web design inspiration from the best portfolio websites</h1>
        <p className="hero-sub">
          Discover curated design portfolio websites. Create your portfolio website with top-notch web design inspiration.
        </p>
        <form
          id="signup"
          className="signup-form"
          onSubmit={e => e.preventDefault()}
          aria-label="Email signup"
        >
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            className="email-input"
            aria-label="Email address"
          />
          <button type="submit" className="btn btn-primary">Get inspired →</button>
        </form>
      </m.section>

      {/* ── Curation ── */}
      <section className="curation" aria-label="Portfolio directory">
        <div className="filter-bar">
          <div className="tabs" role="tablist" aria-label="Portfolio categories">
            {TABS.map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`tab${activeTab === tab ? ' tab-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="dropdowns">
            {DROPDOWNS.map(d => (
              <Dropdown
                key={d.id}
                dropdown={d}
                isOpen={openDropdown === d.id}
                onToggle={setOpenDropdown}
              />
            ))}
          </div>
        </div>

        {chips.length > 0 && (
          <div className="chips" aria-label="Active filters">
            {chips.map(chip => (
              <button
                key={chip}
                className="chip"
                onClick={() => setChips(chips.filter(c => c !== chip))}
                aria-label={`Remove ${chip} filter`}
              >
                {chip} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}

        <div className="portfolio-grid">
          {PORTFOLIOS.map((p, i) => (
            <m.article
              key={p.id}
              className="portfolio-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: 'easeOut' }}
            >
              <div className="card-image" role="img" aria-label="Portfolio preview placeholder" />
              <p className="card-author">{p.author}</p>
            </m.article>
          ))}
        </div>
      </section>

    </div>
  );
}
