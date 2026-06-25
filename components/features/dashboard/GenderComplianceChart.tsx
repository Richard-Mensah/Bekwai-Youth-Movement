"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Datum = { arm: string; female: number }

const DEFAULT: Datum[] = [
  { arm: "Cabinet", female: 42 },
  { arm: "Council", female: 38 },
  { arm: "Parliament", female: 45 },
  { arm: "CIN", female: 33 },
]

const FLOOR = 40

/** 40% gender-equality compliance monitor (Governance Doc §9.3). */
export default function GenderComplianceChart({
  data = DEFAULT,
}: {
  data?: Datum[]
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="arm" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
          <Tooltip formatter={(value) => [`${value}%`, "Female"]} />
          <ReferenceLine
            y={FLOOR}
            stroke="#8E1B1B"
            strokeDasharray="4 4"
            label={{ value: "40% floor", fontSize: 11, fill: "#8E1B1B" }}
          />
          <Bar dataKey="female" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.female >= FLOOR ? "#14342B" : "#8E1B1B"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
