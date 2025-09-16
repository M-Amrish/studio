"use client"

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface PotentialChartProps {
    harvested: number;
    demand: number;
    stored: number;
    recharged: number;
}

export function PotentialChart({ harvested, demand, stored, recharged}: PotentialChartProps) {
  const data = [
    {
      subject: "Harvested",
      value: harvested,
      fullMark: Math.max(harvested, demand),
    },
    {
      subject: "Demand",
      value: demand,
      fullMark: Math.max(harvested, demand),
    },
    {
      subject: "Stored",
      value: stored,
      fullMark: Math.max(harvested, demand),
    },
    {
      subject: "Recharged",
      value: recharged,
      fullMark: Math.max(harvested, demand),
    },
  ]

  return (
    <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
            <Tooltip
                contentStyle={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                }}
            />
            <Legend />
            <Radar name="Water Balance" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
        </RadarChart>
        </ResponsiveContainer>
    </div>
  )
}
