import { useState, useEffect, useRef, useMemo } from 'react';
import { m } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import heroImage from './assets/header-image.png';
import { urlFor } from './lib/sanity';
import {
  fetchProjects,
  fetchStyles,
  fetchProjectBySlug,
  fetchCategoryBySlug,
  fetchProjectsByCategorySlug,
} from './lib/queries';

/* ── History router ───────────────────────────────── */

const RESERVED_SEGMENTS = new Set(['portfolio', 'studio']);

function parsePath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { page: 'home' };

  const segments = path.split('/').filter(Boolean);
  if (segments[0] === 'portfolio' && segments[1]) {
    return { page: 'detail', slug: decodeURIComponent(segments[1]) };
  }
  if (segments.length === 1 && !RESERVED_SEGMENTS.has(segments[0])) {
    return { page: 'category', slug: decodeURIComponent(segments[0]) };
  }

  return { page: 'home' };
}

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return pathname;
}

function navigate(path) {
  window.scrollTo(0, 0);
  const target = path.startsWith('/') ? path : `/${path}`;
  if (window.location.pathname !== target) {
    window.history.pushState(null, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return undefined;
    const previous = document.title;
    document.title = title;
    return () => { document.title = previous; };
  }, [title]);
}

/* ── Shared components ────────────────────────────── */

const NAV_CTA_LABEL = 'Get inspired →';
const NAV_CTA_CHAR_DELAY = 0.01;

function AnimatedButtonText({ text, className = 'btn-animated-text' }) {
  return (
    <span data-button-animate-chars="" className={className} aria-hidden="true">
      {[...text].map((char, index) => (
        <span
          key={`${char}-${index}`}
          style={{
            transitionDelay: `${index * NAV_CTA_CHAR_DELAY}s`,
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

function InspireCta({ className = 'nav-cta', id }) {
  return (
    <a
      href="#signup"
      id={id}
      className={`btn btn-primary btn-animated ${className}`.trim()}
      aria-label={NAV_CTA_LABEL}
    >
      <span className="btn-animated-bg" aria-hidden="true" />
      <AnimatedButtonText text={NAV_CTA_LABEL} />
    </a>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <button className="nav-logo" onClick={() => navigate('/')}>
        <img src="/logo.svg" alt="" aria-hidden="true" className="logo-icon" />
        <span className="logo-text">Best Portfolio Websites</span>
      </button>
      <InspireCta />
    </nav>
  );
}

function StyleFilterDropdown({ options, selected, onChange, isOpen, onToggle }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onToggle(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onToggle]);

  return (
    <div className="dropdown-wrap" ref={ref}>
      <button
        type="button"
        className={`btn-dropdown${isOpen ? ' dropdown-open' : ''}`}
        onClick={() => onToggle(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {(selected.length > 0 ? `Style (${selected.length})` : 'Style')}{' '}
        <span className="chevron" aria-hidden="true">▾</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu" role="menu" aria-label="Filter by style">
          {options.length === 0 ? (
            <p className="dropdown-empty">No styles in CMS yet</p>
          ) : (
            options.map(style => {
              const isChecked = selected.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  className={`dropdown-item${isChecked ? ' dropdown-item--checked' : ''}`}
                  role="menuitemcheckbox"
                  aria-checked={isChecked}
                  onClick={() => {
                    onChange(
                      isChecked
                        ? selected.filter(s => s !== style)
                        : [...selected, style],
                    );
                  }}
                >
                  <span className="dropdown-checkbox" aria-hidden="true">
                    {isChecked && (
                      <svg className="dropdown-checkbox-icon" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6.25L5 8.75L9.5 3.75"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="dropdown-item-label">{style}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function StyleFilterBar({ options, selected, onChange, isOpen, onToggle }) {
  return (
    <div className="filter-bar-style">
      <div className="dropdowns">
        <StyleFilterDropdown
          options={options}
          selected={selected}
          onChange={onChange}
          isOpen={isOpen}
          onToggle={onToggle}
        />
        {selected.length > 0 && (
          <button
            type="button"
            className="filter-clear"
            onClick={() => {
              onChange([]);
              onToggle(false);
            }}
          >
            Remove filters
          </button>
        )}
      </div>
    </div>
  );
}

function PortfolioGrid({ projects }) {
  return (
    <div className="portfolio-grid">
      {projects.map((p, i) => {
        const thumbnailUrl = urlFor(p.thumbnail);
        return (
          <m.article
            key={p._id}
            className="portfolio-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: 'easeOut' }}
            onClick={() => p.slug && navigate(`/portfolio/${p.slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && p.slug && navigate(`/portfolio/${p.slug}`)}
            aria-label={`View ${p.portfolioName}`}
          >
            <div className="card-image" aria-hidden="true">
              {thumbnailUrl && (
                <img src={thumbnailUrl} alt="" loading="lazy" />
              )}
            </div>
            <p className="card-author">{p.portfolioName}</p>
          </m.article>
        );
      })}
    </div>
  );
}

/* ── Home page ────────────────────────────────────── */

function HomePage() {
  const [activeTab, setActiveTab]         = useState('All');
  const [styleOpen, setStyleOpen]         = useState(false);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [projects, setProjects]           = useState([]);
  const [styles, setStyles]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const styleOptions = useMemo(
    () => styles.map(s => s.title).filter(Boolean),
    [styles],
  );

  const tabs = useMemo(() => {
    const used = [...new Set(projects.map(p => p.category).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
    return ['All', ...used];
  }, [projects]);

  useEffect(() => {
    if (activeTab !== 'All' && !tabs.includes(activeTab)) {
      setActiveTab('All');
    }
  }, [tabs, activeTab]);

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (activeTab !== 'All') {
      result = result.filter(p => p.category === activeTab);
    }
    if (selectedStyles.length > 0) {
      result = result.filter(p => {
        const projectStyles = p.styles ?? [];
        return selectedStyles.some(style => projectStyles.includes(style));
      });
    }
    return result;
  }, [projects, activeTab, selectedStyles]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([fetchProjects(), fetchStyles()])
      .then(([projectData, styleData]) => {
        if (!cancelled) {
          setProjects(projectData ?? []);
          setStyles(styleData ?? []);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? 'Failed to load portfolios');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <m.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            Best portfolio websites for designers &amp; creatives
          </m.h1>
          <m.p
            className="hero-sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          >
            Discover curated portfolio websites from leading designers, creatives, and digital studios.
          </m.p>
          <InspireCta id="signup" className="nav-cta hero-cta" />
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Portfolio design inspiration" />
        </div>
      </section>

      <section className="curation" aria-label="Portfolio directory">
        <div className="filter-bar">
          <div className="tabs" role="tablist" aria-label="Portfolio categories">
            {tabs.map(tab => (
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
          <span className="filter-bar-divider" aria-hidden="true" />
          <StyleFilterBar
            options={styleOptions}
            selected={selectedStyles}
            onChange={setSelectedStyles}
            isOpen={styleOpen}
            onToggle={setStyleOpen}
          />
        </div>

        {error && <p className="grid-status grid-status--error" role="alert">{error}</p>}
        {loading && !error && <p className="grid-status">Loading portfolios…</p>}

        {!loading && !error && <PortfolioGrid projects={filteredProjects} />}
      </section>
    </>
  );
}

/* ── Detail page ──────────────────────────────────── */

function DetailPage({ slug }) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPortfolio(null);
    fetchProjectBySlug(slug)
      .then(data => {
        if (!cancelled) {
          if (!data) setError('Portfolio not found');
          else setPortfolio(data);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? 'Failed to load portfolio');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <p className="detail-status">Loading portfolio…</p>;
  }

  if (error || !portfolio) {
    return (
      <div className="detail-status">
        <p role="alert">{error ?? 'Portfolio not found'}</p>
        <button className="back-link" onClick={() => navigate('/')}>
          ← Back to overview
        </button>
      </div>
    );
  }

  const mediaUrl = urlFor(portfolio.media);
  const hasDescription = Array.isArray(portfolio.portfolioDescription) && portfolio.portfolioDescription.length > 0;

  return (
    <m.div
      className="detail-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <aside className="detail-sidebar">
        <button className="back-link" onClick={() => navigate('/')}>
          ← Overview
        </button>

        {portfolio.portfolioName && (
          <h1 className="detail-title">{portfolio.portfolioName}</h1>
        )}

        {hasDescription && (
          <div className="detail-description">
            <PortableText value={portfolio.portfolioDescription} />
          </div>
        )}

        {(portfolio.category || portfolio.portfolioType?.length || portfolio.curator?.name) && (
          <dl className="detail-meta">
            {portfolio.category && (
              <div className="meta-row">
                <dt className="meta-label">Category</dt>
                <dd className="meta-value">{portfolio.category}</dd>
              </div>
            )}
            {portfolio.portfolioType?.length > 0 && (
              <div className="meta-row">
                <dt className="meta-label">Style</dt>
                <dd className="meta-value">{portfolio.portfolioType.join(', ')}</dd>
              </div>
            )}
            {portfolio.curator?.name && (
              <div className="meta-row">
                <dt className="meta-label">Curated by</dt>
                <dd className="curator">
                  {portfolio.curator.link ? (
                    <a
                      href={portfolio.curator.link}
                      className="curator-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {urlFor(portfolio.curator.image) ? (
                        <img
                          className="curator-avatar"
                          src={urlFor(portfolio.curator.image)}
                          alt=""
                          width={28}
                          height={28}
                        />
                      ) : (
                        <span className="curator-avatar" aria-hidden="true" />
                      )}
                      <span className="meta-value">{portfolio.curator.name}</span>
                    </a>
                  ) : (
                    <>
                      {urlFor(portfolio.curator.image) ? (
                        <img
                          className="curator-avatar"
                          src={urlFor(portfolio.curator.image)}
                          alt=""
                          width={28}
                          height={28}
                        />
                      ) : (
                        <span className="curator-avatar" aria-hidden="true" />
                      )}
                      <span className="meta-value">{portfolio.curator.name}</span>
                    </>
                  )}
                </dd>
              </div>
            )}
          </dl>
        )}

        {portfolio.portfolioLink && (
          <a
            href={portfolio.portfolioLink}
            className="btn btn-primary btn-full btn-animated detail-cta"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View portfolio"
          >
            <span className="btn-animated-bg" aria-hidden="true" />
            <AnimatedButtonText text="View portfolio ↗" />
          </a>
        )}
      </aside>

      <div className="detail-preview" aria-label="Portfolio preview">
        <div className="preview-inner">
          {mediaUrl ? (
            <img
              src={mediaUrl}
              alt={portfolio.portfolioName ? `${portfolio.portfolioName} preview` : ''}
              className="preview-hero"
            />
          ) : (
            <div className="preview-placeholder" aria-hidden="true">
              <div className="preview-block preview-block--wide" />
              <div className="preview-block preview-block--narrow" />
              <div className="preview-block preview-block--tall" />
            </div>
          )}
        </div>
      </div>
    </m.div>
  );
}

/* ── Category page ────────────────────────────────── */

function CategoryPage({ slug }) {
  const [category, setCategory]           = useState(null);
  const [projects, setProjects]           = useState([]);
  const [styles, setStyles]               = useState([]);
  const [styleOpen, setStyleOpen]         = useState(false);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  useDocumentTitle(category?.metaTitle);

  const styleOptions = useMemo(
    () => styles.map(s => s.title).filter(Boolean),
    [styles],
  );

  const filteredProjects = useMemo(() => {
    if (selectedStyles.length === 0) return projects;
    return projects.filter(p => {
      const projectStyles = p.styles ?? [];
      return selectedStyles.some(style => projectStyles.includes(style));
    });
  }, [projects, selectedStyles]);

  useEffect(() => {
    setSelectedStyles([]);
    setStyleOpen(false);
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCategory(null);
    setProjects([]);
    Promise.all([
      fetchCategoryBySlug(slug),
      fetchProjectsByCategorySlug(slug),
      fetchStyles(),
    ])
      .then(([categoryData, projectData, styleData]) => {
        if (cancelled) return;
        if (!categoryData) {
          setError('Category not found');
          return;
        }
        setCategory(categoryData);
        setProjects(projectData ?? []);
        setStyles(styleData ?? []);
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? 'Failed to load category');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <p className="detail-status">Loading category…</p>;
  }

  if (error || !category) {
    return (
      <div className="detail-status">
        <p role="alert">{error ?? 'Category not found'}</p>
        <button className="back-link" type="button" onClick={() => navigate('/')}>
          ← Back to overview
        </button>
      </div>
    );
  }

  const heading = category.h1 || category.title;
  const hasDescription = Array.isArray(category.description) && category.description.length > 0;

  return (
    <>
      <header className="category-header">
        <m.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {heading}
        </m.h1>
        {hasDescription && (
          <m.div
            className="category-description"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          >
            <PortableText value={category.description} />
          </m.div>
        )}
      </header>

      <section className="curation" aria-label={`${heading} portfolios`}>
        <div className="filter-bar filter-bar--style-only">
          <StyleFilterBar
            options={styleOptions}
            selected={selectedStyles}
            onChange={setSelectedStyles}
            isOpen={styleOpen}
            onToggle={setStyleOpen}
          />
        </div>

        {filteredProjects.length === 0 && (
          <p className="grid-status">No portfolios in this category yet.</p>
        )}

        {filteredProjects.length > 0 && (
          <PortfolioGrid projects={filteredProjects} />
        )}
      </section>
    </>
  );
}

/* ── Root ─────────────────────────────────────────── */

export default function App() {
  const pathname = usePathname();
  const route = parsePath(pathname);

  return (
    <div className="page">
      <Navbar />
      {route.page === 'detail' && <DetailPage slug={route.slug} />}
      {route.page === 'category' && <CategoryPage slug={route.slug} />}
      {route.page === 'home' && <HomePage />}
    </div>
  );
}
