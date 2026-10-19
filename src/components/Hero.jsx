// Hero content is hardcoded by design — only the program schedule comes from JSON.
export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Full-bleed background image */}
      <img
        src="./hero.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full min-h-[100lvh] w-full rounded-none object-cover object-right"
      />

      {/* Readability overlay — more opaque on the left where the text sits, then
          fading to reveal the image on the right. The extra veil kicks in only on
          mobile, where the text spans the full width over the image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] from-[0%] to-transparent to-[72%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[var(--color-bg)]/60 md:hidden" />

      {/* Content — 10% horizontal margins, vertically centered, left-aligned */}
      <div className="relative flex min-h-[100svh] flex-col justify-center px-[10%] py-24 md:py-16 lg:min-h-[90svh]">
        <div className="max-w-xl">

          <h1 className="mb-6 font-heading text-6xl font-semibold leading-[1.04] md:text-8xl italic">
            From thought
            <br />
            to practice
          </h1>

          <p className="mb-4 max-w-xl md:max-w-lg font-body text-xl leading-snug md:text-2xl font-medium">
            A Dialogue Between{' '}
            <span className="italic text-accent">Artificial Intelligence</span>
            {' '}and{' '}
            <span className="italic text-accent">Digital Humanities</span>
          </p>

          <p className="mb-4 font-body text-sm text-text-muted">
            5-6 November 2026 <br/> Aula 3, Via Zamboni 32 - Aula Affreschi, via Zamboni 34, Bologna
          </p>

{/*           <p className="max-w-md font-body text-lg leading-relaxed text-text-base">
            An international seminar and a workshop to answer the question: <span className="italic text-accent font-medium">how does humanistic research change in the era of Artificial Intelligence?</span>
          </p> */}

          {/* Registration CTA */}
          <div className="mt-12 flex flex-col items-start gap-3">
            <span className="font-body text-sm text-text-muted">
              Free event. Previous registration required
            </span>
            <a
              href="https://forms.gle/62vN1F5wV9PKEYRs8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg border-[2px] border-accent bg-[var(--color-bg)] pl-7 pr-6 py-3 font-body text-lg font-medium text-accent transition-colors hover:bg-accent hover:text-[var(--color-bg)]"
            >
              {'Register to attend →'}
            </a>
            <span className="font-body text-sm text-text-muted">
              In presence (limited places) and online
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
