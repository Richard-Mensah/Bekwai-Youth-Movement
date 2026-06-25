import { cn } from "@/lib/utils"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export default function Input({ label, error, id, className, ...props }: Props) {
  const inputId = id ?? props.name
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-ink/75"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy",
          error && "border-brand-red focus:border-brand-red focus:ring-brand-red",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  )
}
