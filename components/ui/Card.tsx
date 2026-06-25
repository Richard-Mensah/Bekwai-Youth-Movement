import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
  id?: string
}

export default function Card({ children, className, id }: Props) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
}
