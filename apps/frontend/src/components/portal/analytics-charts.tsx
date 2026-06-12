"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface HistoricalIncident {
  year: string;
  incidents: number;
  displaced: number;
}

interface AnalyticsChartsProps {
  historicalIncidents: HistoricalIncident[];
  mounted: boolean;
}

export default function AnalyticsCharts({ historicalIncidents, mounted }: AnalyticsChartsProps) {
  return (
    <section id="analytics" className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Historical incidents</h2>
        <p className="text-xs text-muted-foreground">Recorded flood events nationwide</p>
        <div className="mt-4 h-64 w-full min-w-0 relative">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={historicalIncidents}>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12, color: "#fff" }} />
                <Bar dataKey="incidents" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Displacement trend</h2>
        <p className="text-xs text-muted-foreground">People displaced (thousands)</p>
        <div className="mt-4 h-64 w-full min-w-0 relative">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={historicalIncidents}>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12, color: "#fff" }} />
                <Line type="monotone" dataKey="displaced" stroke="var(--color-chart-5)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
