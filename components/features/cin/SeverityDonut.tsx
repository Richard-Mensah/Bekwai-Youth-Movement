"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { SEVERITY_COLOR } from "@/constants/cin"
import type { Severity } from "@/types"

type Datum = { severity: Severity; label: string; count: number }

export default function SeverityDonut({ data }: { data: Datum[] }) {
  const filtered = data.filter((d) => d.count > 0)
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filtered}
            dataKey="count"
            nameKey="label"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {filtered.map((d) => (
              <Cell key={d.severity} fill={SEVERITY_COLOR[d.severity]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
