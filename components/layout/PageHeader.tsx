type Props = {
  eyebrow?: string
  title: string
  description?: string
}

/** Standard banner for inner public pages. */
export default function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <section className="border-b border-gray-200 bg-brand-green-900 text-white">
      <div className="container-content py-14">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue-100">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-gray-200">{description}</p>
        )}
      </div>
    </section>
  )
}
