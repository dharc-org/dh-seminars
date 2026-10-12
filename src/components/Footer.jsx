// Hardcoded. The footer is the ONLY section with a dark background.
// Colors come from theme.css variables (no hardcoded hex): the dark surface is
// --color-text and the light text/logos are --color-bg.
// Logos are loaded with RELATIVE paths so they resolve from /<slug>/ too.
const supporters = [
  {
    label: 'Founded by',
    src: './logos/department.png',
    alt: 'Department of Classical Philology and Italian Studies, University of Bologna logo',
    // TODO: point this at the department's own public page when available.
    href: 'https://ficlit.unibo.it',
  },
  {
    label: 'Supported by',
    src: './logos/boldh.svg',
    alt: 'BoLDH logo',
    href: 'https://dharc-org.github.io/boldh/',
  },
  {
    label: 'With the patronage of',
    src: './logos/aiucd.svg',
    alt: 'AIUCD logo',
    href: 'https://www.aiucd.it/',
  },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text)] text-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl px-8 py-16">
        {/* Supporters: a label above each logo, laid out as three columns. */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
          {supporters.map((s) => (
            <div key={s.label} className="flex flex-col items-start gap-3">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-[var(--color-bg)]/70">
                {s.label}
              </p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-70"
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  className="h-12 w-auto rounded-none object-contain md:h-14"
                />
              </a>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <p className="mt-14 border-t border-[var(--color-text-muted)]/40 pt-8 font-body text-sm text-[var(--color-bg)]">
          © 2026 /DH.arc seminars — University of Bologna
        </p>
      </div>
    </footer>
  )
}
