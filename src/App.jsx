import { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';

/* ── Data ─────────────────────────────────────────── */

const PORTFOLIOS = [
  {
    id: 0,
    author: 'Bleed Design Studio',
    description: 'Award-winning Scandinavian studio blending design, technology, art, and strategy to build distinguished brand identities and immersive digital experiences.',
    category: 'Brand',
    styles: ['Clean', 'Modern'],
    url: '#',
  },
  {
    id: 1,
    author: 'Pentagram',
    description: "The world's largest independent design consultancy, creating visual identities, products, and environments for global brands.",
    category: 'Brand',
    styles: ['Bold', 'Editorial'],
    url: '#',
  },
  {
    id: 2,
    author: 'Rauno Freiberg',
    description: 'Product designer focused on interface craftsmanship — building tools that feel inevitable and interactions that feel alive.',
    category: 'Product',
    styles: ['Minimal', 'Clean'],
    url: '#',
  },
  {
    id: 3,
    author: 'Femke van Schoonhoven',
    description: 'Senior product designer and content creator sharing the craft of UX design through writing, videos, and thoughtful case studies.',
    category: 'UX',
    styles: ['Clean', 'Minimal'],
    url: '#',
  },
  {
    id: 4,
    author: 'Stripe Press',
    description: 'A publishing house focused on ideas about economic progress, using thoughtful design to make complex topics accessible and beautiful.',
    category: 'Web',
    styles: ['Editorial', 'Bold'],
    url: '#',
  },
  {
    id: 5,
    author: 'Linear Design',
    description: 'The brand identity and design system of a product built for velocity — refined, opinionated, and systematically precise.',
    category: 'Product',
    styles: ['Minimal', 'Modern'],
    url: '#',
  },
  {
    id: 6,
    author: 'Zhenya Rynzhuk',
    description: 'Creative developer and visual designer exploring the intersection of motion, interaction, and identity through experimental digital work.',
    category: 'Web',
    styles: ['Bold', 'Playful'],
    url: '#',
  },
  {
    id: 7,
    author: 'Diana Mounter',
    description: 'Design systems lead focused on the infrastructure of design — creating scalable, accessible component libraries for complex products.',
    category: 'UI',
    styles: ['Clean', 'Modern'],
    url: '#',
  },
];

const TABS = ['All', 'Product', 'Web', 'UX', 'UI', 'Brand'];

const DROPDOWNS = [
  { id: 'discipline', label: 'Discipline', options: ['Product Design', 'Visual Design', 'Motion', 'Illustration'] },
  { id: 'role',       label: 'Role',       options: ['Junior', 'Mid', 'Senior', 'Lead', 'Director'], badge: 2 },
  { id: 'style',      label: 'Style',      options: ['Minimal', 'Bold', 'Editorial', 'Playful'] },
  { id: 'platform',   label: 'Platform',   options: ['Web', 'iOS', 'Android', 'Desktop'] },
];

/* ── Hash router ──────────────────────────────────── */

function useHash() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const fn = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);
  return hash;
}

function navigate(path) {
  window.location.hash = path;
}

/* ── Shared components ────────────────────────────── */

function Navbar() {
  return (
    <nav className="navbar">
      <button className="nav-logo" onClick={() => navigate('#/')}>
        <span className="logo-icon" aria-hidden="true" />
        <span className="logo-text">Best Portfolio Websites</span>
      </button>
      <a href="#signup" className="btn btn-secondary">Get inspired →</a>
    </nav>
  );
}

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
        {dropdown.label}{dropdown.badge ? ` (${dropdown.badge})` : ''}{' '}
        <span className="chevron" aria-hidden="true">▾</span>
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

/* ── Home page ────────────────────────────────────── */

function HomePage() {
  const [activeTab, setActiveTab]       = useState('All');
  const [chips, setChips]               = useState(['Senior', 'Lead']);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <>
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
              onClick={() => navigate(`#/portfolio/${p.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(`#/portfolio/${p.id}`)}
              aria-label={`View ${p.author}`}
            >
              <div className="card-image" aria-hidden="true" />
              <p className="card-author">{p.author}</p>
            </m.article>
          ))}
        </div>
      </section>
    </>
  );
}

/* ── Detail page ──────────────────────────────────── */

function DetailPage({ portfolio }) {
  return (
    <m.div
      className="detail-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <aside className="detail-sidebar">
        <button className="back-link" onClick={() => navigate('#/')}>
          ← Overview
        </button>

        <h1 className="detail-title">{portfolio.author}</h1>
        <p className="detail-description">{portfolio.description}</p>

        <dl className="detail-meta">
          <div className="meta-row">
            <dt className="meta-label">Category</dt>
            <dd className="meta-value">{portfolio.category}</dd>
          </div>
          <div className="meta-row">
            <dt className="meta-label">Style</dt>
            <dd className="meta-values">
              {portfolio.styles.map(s => (
                <span key={s} className="meta-value">{s}</span>
              ))}
            </dd>
          </div>
          <div className="meta-row">
            <dt className="meta-label">Curated by</dt>
            <dd className="curator">
              <span className="curator-avatar" aria-hidden="true" />
              <span className="meta-value">Stijn Thijssen</span>
            </dd>
          </div>
        </dl>

        <a
          href={portfolio.url}
          className="btn btn-primary btn-full"
          {...(portfolio.url !== '#' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          View portfolio ↗
        </a>
      </aside>

      <div className="detail-preview" aria-label="Portfolio preview">
        <div className="preview-inner">
          <div className="preview-placeholder" aria-hidden="true">
            <div className="preview-block preview-block--wide" />
            <div className="preview-block preview-block--narrow" />
            <div className="preview-block preview-block--tall" />
          </div>
        </div>
      </div>
    </m.div>
  );
}

/* ── Root ─────────────────────────────────────────── */

export default function App() {
  const hash = useHash();
  const match = hash.match(/#\/portfolio\/(\d+)/);
  const portfolio = match ? PORTFOLIOS[parseInt(match[1])] : null;

  return (
    <div className="page">
      <Navbar />
      {portfolio ? <DetailPage portfolio={portfolio} /> : <HomePage />}
    </div>
  );
}
