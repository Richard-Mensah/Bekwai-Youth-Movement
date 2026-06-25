"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Datum = { category: string; count: number }

export default function CategoryBarChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, bottom: 4, left: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="category"
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#3C6E9F" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
