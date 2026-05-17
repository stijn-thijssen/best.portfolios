import { m } from 'framer-motion';

const cards = [
  { title: 'Design Portfolios', hint: 'Showcase visual craft' },
  { title: 'Developer Portfolios', hint: 'Highlight shipped products' },
  { title: 'Creative Portfolios', hint: 'Curate standout work' }
];

export default function App() {
  return (
    <main className="layout">
      <m.section
        className="hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <p className="eyebrow">Best Portfolios</p>
        <h1>Build a clean, fast web directory.</h1>
        <p className="subtitle">
          React + Motion starter focused on scalable structure and smooth performance.
        </p>
      </m.section>

      <section className="grid" aria-label="Directory categories">
        {cards.map((card, i) => (
          <m.article
            className="card"
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: 'easeOut' }}
          >
            <h2>{card.title}</h2>
            <p>{card.hint}</p>
          </m.article>
        ))}
      </section>
    </main>
  );
}
