import { ghs } from "@/constants/projects"

type Props = { budget: number; spent: number }

/** Budget vs spent meter with utilisation %. */
export default function BudgetMeter({ budget, spent }: Props) {
  const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const over = spent > budget
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500">Spent</p>
          <p className="text-lg font-bold text-brand-green-700">{ghs(spent)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Budget</p>
          <p className="text-lg font-bold text-gray-700">{ghs(budget)}</p>
        </div>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={over ? "h-full bg-brand-red" : "h-full bg-brand-green"}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-gray-500">
        {pct}% utilised{over && " — over budget"}
      </p>
    </div>
  )
}
