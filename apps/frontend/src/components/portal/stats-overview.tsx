"use client";

import React from "react";
import { Radio, AlertTriangle, CloudRain, Droplets, Shield } from "lucide-react";

interface StatsOverviewProps {
  total: number;
  online: number;
  critical: number;
}

function Stat({ icon: Icon, label, value, unit, delta }: { icon: any; label: string; value: string; unit?: string; delta?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[11px] uppercase tracking-widest font-mono">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-mono font-semibold">{value}</span>
        {unit && <span className="text-xs text-muted-foreground font-mono">{unit}</span>}
      </div>
      {delta && <div className="mt-1 text-[11px] text-primary font-mono">{delta}</div>}
    </div>
  );
}

export default function StatsOverview({ total, online, critical }: StatsOverviewProps) {
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-accent">// Live national overview</div>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Real-time flood intelligence for <span className="text-accent">every Nigerian community</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Distributed solar-powered sentinel nodes stream water level, rainfall and soil saturation data.
            AI-assisted models forecast risk windows from one hour to three days ahead.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-accent pulse-dot" />
          <span className="text-muted-foreground">Network status:</span>
          <span className="text-foreground">{online}/{total} nodes online</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat icon={Radio} label="Sentinel nodes" value={String(total)} unit="active" delta={`+3 deployed this week`} />
        <Stat icon={AlertTriangle} label="Critical alerts" value={String(critical)} unit="now" />
        <Stat icon={CloudRain} label="Rainfall (24h)" value="148" unit="mm avg" delta="↑ 12% vs yesterday" />
        <Stat icon={Droplets} label="Avg water level" value="5.3" unit="m" delta="↑ 0.22m / 6h" />
        <Stat icon={Shield} label="People covered" value="42.1M" unit="across 17 states" />
      </div>
    </section>
  );
}
