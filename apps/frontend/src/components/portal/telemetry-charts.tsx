"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface WaterTrendPoint {
  t: string;
  level: number;
  rain: number;
}

interface RiskForecastItem {
  window: string;
  risk: number;
}

interface TelemetryChartsProps {
  waterTrend: WaterTrendPoint[];
  riskForecast: RiskForecastItem[];
  selectedNodeName: string;
  selectedState: string;
  waterRiseRate: number;
  mounted: boolean;
  sevColor: Record<string, string>;
}

export default function TelemetryCharts({
  waterTrend,
  riskForecast,
  selectedNodeName,
  selectedState,
  waterRiseRate,
  mounted,
  sevColor,
}: TelemetryChartsProps) {
  return (
    <section id="dashboard" className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Water level & rainfall · last 24h</h2>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{selectedNodeName}</div>
        </div>
        <div className="h-72 w-full min-w-0 relative">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={waterTrend}>
                <defs>
                  <linearGradient id="lvl" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12, color: "#fff" }} />
                <Area type="monotone" dataKey="level" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#lvl)" name="Water (m)" />
                <Line type="monotone" dataKey="rain" stroke="var(--color-chart-3)" strokeWidth={1.5} dot={false} name="Rain (mm)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Flood risk forecast</h2>
        <p className="text-xs text-muted-foreground">AI predictive model · region: {selectedState} Basin</p>
        <div className="mt-4 space-y-3">
          {riskForecast.map(r => {
            const tone = r.risk > 75 ? "critical" : r.risk > 55 ? "warning" : r.risk > 35 ? "watch" : "normal";
            return (
              <div key={r.window}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">{r.window} window</span>
                  <span className="font-mono" style={{ color: sevColor[tone] }}>{r.risk}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-bg-base">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.risk}%`, backgroundColor: sevColor[tone] }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 rounded-md border border-border bg-background/40 p-3 text-xs">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">// AI situation report</div>
          <p className="mt-1 leading-relaxed text-foreground/80">
            Water levels across <span className="text-foreground font-semibold">{selectedState}</span> increased by 
            {(waterRiseRate * 6 * 100).toFixed(0)}% during the last six hours, creating risk markers in downstream monitored zones.
          </p>
        </div>
      </div>
    </section>
  );
}
