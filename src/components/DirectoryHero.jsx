import { LazyMotion, domAnimation, m } from 'framer-motion';

const cards = [
  { title: 'Design Portfolios', hint: 'Showcase visual craft' },
  { title: 'Developer Portfolios', hint: 'Highlight shipped products' },
  { title: 'Creative Portfolios', hint: 'Curate standout work' }
];

export default function DirectoryHero() {
  return (
    <LazyMotion features={domAnimation}>
      <main className="layout">
        <m.section
          className="hero"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <p className="eyebrow">Best Portfolios</p>
          <h1>Content-first web directory, built to scale.</h1>
          <p className="subtitle">
            Astro renders most content statically, while React + Motion enhances key interactions.
          </p>
        </m.section>

        <section className="grid" aria-label="Directory categories">
          {cards.map((card, i) => (
            <m.article
              className="card"
              key={card.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: 'easeOut' }}
            >
              <h2>{card.title}</h2>
              <p>{card.hint}</p>
            </m.article>
          ))}
        </section>
      </main>
    </LazyMotion>
  );
}
