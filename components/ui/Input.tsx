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
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green",
          error && "border-brand-red focus:border-brand-red focus:ring-brand-red",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  )
}
