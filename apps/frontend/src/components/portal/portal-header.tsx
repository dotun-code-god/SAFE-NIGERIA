"use client";

import React from "react";
import Link from "next/link";
import { Waves } from "lucide-react";

interface AlertItem {
  id: string;
  severity: "normal" | "watch" | "warning" | "critical" | "emergency";
  title: string;
  place: string;
  ago: string;
}

interface PortalHeaderProps {
  now: Date;
  mounted: boolean;
  alerts: AlertItem[];
  sevColor: Record<string, string>;
}

export default function PortalHeader({ now, mounted, alerts, sevColor }: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-accent">
            <Waves className="h-4 w-4" />
            <span className="pulse-dot absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">SAFE-NIGERIA</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Public Monitoring Portal</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <a href="#map" className="text-muted-foreground hover:text-foreground">Map</a>
          <a href="#dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</a>
          <a href="#alerts" className="text-muted-foreground hover:text-foreground">Alerts</a>
          <a href="#analytics" className="text-muted-foreground hover:text-foreground">Analytics</a>
          <a href="#report" className="text-muted-foreground hover:text-foreground">Report</a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:block">
            {mounted ? now.toUTCString().slice(17, 25) : "--:--:--"} UTC
          </div>
          <Link href="/" className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted">Back to site</Link>
        </div>
      </div>
      {/* ticker */}
      <div className="overflow-hidden border-t border-border bg-card/50">
        <div className="ticker flex whitespace-nowrap py-1.5 text-xs font-mono text-muted-foreground">
          {[...alerts, ...alerts].map((a, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: sevColor[a.severity] }} />
              <span className="text-foreground/80">{a.title}</span>
              <span>· {a.place}</span>
              <span>· {a.ago}</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
