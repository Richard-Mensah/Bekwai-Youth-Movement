"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Datum = { status: string; budget: number; spent: number }

const fmt = (v: number) => `₵${(v / 1000).toFixed(0)}k`

/** Budget vs spent grouped by project status. */
export default function BudgetChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="status" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => `₵${Number(value).toLocaleString()}`} />
          <Legend />
          <Bar dataKey="budget" name="Budget" fill="#3C6E9F" radius={[4, 4, 0, 0]} />
          <Bar dataKey="spent" name="Spent" fill="#1F4D3F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
