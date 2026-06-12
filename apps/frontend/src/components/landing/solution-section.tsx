import React from "react";
import { SectionLabel } from "./section-label";
import { Sun, Radio, Droplets, Cpu, Zap } from "lucide-react";

export function SolutionSection() {
  return (
    <section id="solution" className="relative border-y border-border bg-card/30">
      <div className="mx-auto grid w-full max-w-none items-center gap-16 px-8 py-28 md:grid-cols-2">
        <div>
          <SectionLabel>The Solution</SectionLabel>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Ground-truth data from the river's edge.
          </h2>
          <p className="mt-5 text-muted-foreground">
            SAFE-NIGERIA deploys a ruggedized network of solar-powered{" "}
            <span className="text-foreground font-semibold">Sentinel Nodes</span> across high-risk riverine
            choke points. Ultrasonic sensors, rain gauges, and soil-moisture probes feed a
            mesh of edge processors — bypassing the cell towers that fail first when storms
            hit.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Solar + battery autonomy — no grid dependency",
              "LoRa mesh that survives when mobile networks go dark",
              "Edge AI (Gemma) filters false alerts before they reach agencies",
              "Open data feeds for citizens, NGOs, and researchers",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Zap className="h-3 w-3" />
                </span>
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Product visual */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-background/60 p-8 shadow-[var(--shadow-elevated)] backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Sentinel Node · v1
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                ONLINE
              </span>
            </div>

            {/* Hardware composite */}
            <div className="relative mt-4 grid grid-cols-5 gap-4">
              <div className="col-span-2 relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-b from-card to-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/sentinel-pole.png"
                  alt="Solar-powered Sentinel Node pole deployment"
                  className="h-full w-full object-contain p-2"
                />
              </div>
              <div className="col-span-3 relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-card to-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/edge-board.png"
                  alt="Edge-logic processor board with LoRa antennas"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary backdrop-blur">
                  Edge AI · Gemma 2B
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <NodeSpec icon={Sun} label="Solar input" value="18W" />
              <NodeSpec icon={Radio} label="LoRa range" value="10km+" />
              <NodeSpec icon={Droplets} label="Water level" value="±2cm" />
              <NodeSpec icon={Cpu} label="Edge AI" value="Gemma 2B" />
            </div>
            <div className="mt-5 rounded-xl bg-card p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Live telemetry</span>
                <span className="font-mono">14:02:18 WAT</span>
              </div>
              <SignalChart />
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
        </div>

      </div>
    </section>
  );
}

function NodeSpec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

function SignalChart() {
  const pts = [22, 28, 26, 34, 31, 40, 38, 48, 52, 47, 58, 64, 60, 72, 78];
  const max = 80;
  const w = 280;
  const h = 60;
  const step = w / (pts.length - 1);
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-16 w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#g)" />
      <path d={d} fill="none" stroke="var(--signal)" strokeWidth="1.5" />
    </svg>
  );
}
