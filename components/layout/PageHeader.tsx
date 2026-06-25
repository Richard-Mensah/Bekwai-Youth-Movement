type Props = {
  eyebrow?: string
  title: string
  description?: string
}

/** Standard banner for inner public pages. */
export default function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-canopy/10 bg-canopy text-white">
      <div className="absolute inset-0 canopy-texture" />
      <div className="container-content relative py-16 sm:py-20">
        {eyebrow && (
          <p className="eyebrow-light">
            <span className="h-px w-6 bg-gold-400" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-white text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-lg text-white/75 text-pretty">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
