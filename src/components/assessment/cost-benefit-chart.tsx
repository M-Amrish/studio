"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CostBenefitChartProps {
    investment: number;
    savings: number;
}

export function CostBenefitChart({ investment, savings }: CostBenefitChartProps) {
    const data = Array.from({ length: 10 }, (_, i) => {
        const year = i + 1;
        return {
            name: `Year ${year}`,
            "Cumulative Savings": savings * year,
            "Initial Investment": investment,
        }
    });

  return (
    <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="₹" tickFormatter={(value) => new Intl.NumberFormat('en-IN').format(value as number)} />
            <Tooltip
                formatter={(value: number) => `₹${new Intl.NumberFormat('en-IN').format(value)}`}
                contentStyle={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                }}
            />
            <Legend />
            <Bar dataKey="Initial Investment" fill="hsl(var(--destructive))" />
            <Bar dataKey="Cumulative Savings" fill="hsl(var(--primary))" />
        </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
