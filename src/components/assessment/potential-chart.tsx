"use client"

import { Sector, Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts"

interface PotentialChartProps {
    harvested: number;
    demand: number;
    stored: number;
    recharged: number;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function PotentialChart({ harvested, demand, stored, recharged}: PotentialChartProps) {
  const data = [
    { name: "Harvested", value: harvested },
    { name: "Demand", value: demand },
    { name: "Stored", value: stored },
    { name: "Recharged", value: recharged },
  ]

  const total = data.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                    }}
                    formatter={(value: number, name: string) => [`${value.toLocaleString()} L`, name]}
                />
                <Legend />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={true}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    </div>
  )
}
