"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface PotentialChartProps {
    harvested: number;
    demand: number;
    stored: number;
    recharged: number;
}

export function PotentialChart({ harvested, demand, stored, recharged}: PotentialChartProps) {
  const data = [
    {
      name: "Water Balance",
      "Total Harvested": harvested,
      "Annual Demand": demand,
      "Stored in Tank": stored,
      "Recharged": recharged,
    },
  ]

  return (
    <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit=" L" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
            <Tooltip
            contentStyle={{
                background: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
            }}
            />
            <Legend />
            <Bar dataKey="Total Harvested" fill="hsl(var(--primary))" />
            <Bar dataKey="Annual Demand" fill="hsl(var(--destructive))" />
            <Bar dataKey="Stored in Tank" fill="#82ca9d" />
            <Bar dataKey="Recharged" fill="hsl(var(--accent))" />
        </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
