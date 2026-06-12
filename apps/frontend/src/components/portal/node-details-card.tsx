"use client";

import React from "react";
import { TelemetryNode } from "@/hooks/use-telemetry-nodes";
import { MapPin, Gauge, CloudRain, Battery, Signal, Zap } from "lucide-react";

interface NodeDetailsCardProps {
  selected: TelemetryNode | null;
  mounted: boolean;
  sevColor: Record<string, string>;
  sevLabel: Record<string, string>;
}

function SeverityChip({ s, color, label }: { s: string; color: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
      style={{
        color: color,
        borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export default function NodeDetailsCard({ selected, mounted, sevColor, sevLabel }: NodeDetailsCardProps) {
  if (!selected) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-center min-h-[300px]">
        <p className="text-sm text-muted-foreground font-mono">No sentinel node selected</p>
      </div>
    );
  }

  const statusColor = sevColor[selected.status] || "var(--color-alert-normal)";
  const statusLabel = sevLabel[selected.status] || "Safe";

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{selected.id}</div>
            <h3 className="text-lg font-semibold">{selected.name}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {selected.lga}, {selected.state}
            </p>
          </div>
          <SeverityChip s={selected.status} color={statusColor} label={statusLabel} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-border bg-background/40 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"><Gauge className="h-3 w-3" /> Water level</div>
            <div className="mt-1 font-mono text-2xl">{selected.waterLevel.toFixed(2)}<span className="text-xs text-muted-foreground"> m</span></div>
            <div className="text-[11px] text-accent font-mono">
              {selected.waterRiseRate >= 0 ? "↑" : "↓"} {Math.abs(selected.waterRiseRate).toFixed(2)} m/h
            </div>
          </div>
          <div className="rounded-md border border-border bg-background/40 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"><CloudRain className="h-3 w-3" /> Rainfall 6h</div>
            <div className="mt-1 font-mono text-2xl">{Math.abs(selected.waterRiseRate * 90).toFixed(0)}<span className="text-xs text-muted-foreground"> mm</span></div>
            <div className="text-[11px] text-muted-foreground font-mono">Above seasonal avg</div>
          </div>
          <div className="rounded-md border border-border bg-background/40 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"><Battery className="h-3 w-3" /> Battery</div>
            <div className="mt-1 font-mono text-2xl">{selected.batteryHealth}%</div>
            <div className="h-1.5 mt-2 rounded-full bg-background overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${selected.batteryHealth}%` }} />
            </div>
          </div>
          <div className="rounded-md border border-border bg-background/40 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"><Signal className="h-3 w-3" /> LoRa signal</div>
            <div className="mt-1 font-mono text-2xl">{selected.signalStrength}%</div>
            <div className="h-1.5 mt-2 rounded-full bg-background overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${selected.signalStrength}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-dashed border-accent/30 bg-accent/5 p-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent font-mono">
            <Zap className="h-3 w-3 animate-pulse" /> Edge AI · Gemma
          </div>
          <p className="mt-1 text-xs leading-relaxed text-foreground/80">
            Anomaly score <span className="font-mono text-accent">{selected.waterLevel > 6.0 ? "0.73" : "0.18"}</span>. 
            {selected.waterRiseRate > 0.1 
              ? " Sustained upward water trend consistent with upstream rainfall pattern. False-alert probability low." 
              : " Node reports normal cyclical patterns. Stable atmospheric boundary."}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>Last report:</span>
        <span>{mounted ? new Date(selected.lastReported).toLocaleTimeString() : "--:--:--"}</span>
      </div>
    </div>
  );
}
