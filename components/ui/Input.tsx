import { cn } from "@/lib/utils"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  /** Control pinned inside the field's right edge — e.g. a show/hide toggle. */
  trailing?: React.ReactNode
  /** Hint shown under the field when there is no error. */
  hint?: React.ReactNode
}

export default function Input({
  label,
  error,
  id,
  className,
  trailing,
  hint,
  ...props
}: Props) {
  const inputId = id ?? props.name
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-ink/75 dark:text-paper/75"
      >
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(
            "block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-700 dark:text-paper dark:placeholder:text-paper/35",
            trailing && "pr-11",
            error && "border-brand-red focus:border-brand-red focus:ring-brand-red",
            className
          )}
          {...props}
        />
        {trailing && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-1.5">
            {trailing}
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-brand-red">{error}</p>
      ) : (
        hint && (
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">{hint}</p>
        )
      )}
    </div>
  )
}
