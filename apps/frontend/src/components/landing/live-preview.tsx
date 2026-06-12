"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MapProvider } from "react-map-gl/mapbox";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "./section-label";
import { useTelemetryNodes } from "@/hooks/use-telemetry-nodes";

// Dynamically import Mapbox canvas component with SSR disabled
const FloodMap = dynamic(() => import("@/components/portal/flood-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-[#0B0F19] flex items-center justify-center font-mono text-xs text-white/40">
      Initializing WebGL Canvas...
    </div>
  ),
});

export function LivePreview() {
  const { nodes, selectedNodeId, selectNode } = useTelemetryNodes();

  return (
    <MapProvider>
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid w-full max-w-[90%] lg:max-w-[75%] items-center gap-12 py-24 md:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionLabel>Live Preview</SectionLabel>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Watch Nigeria's rivers breathe.
            </h2>
            <p className="mt-5 text-muted-foreground">
              The public portal opens flood intelligence to every Nigerian. Browse sensor
              readings, river forecasts, and active alerts on an interactive national map.
            </p>
            <Link
              href="/portal"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Open Portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-[#0B0F19] shadow-[var(--shadow-elevated)] min-h-[350px] md:min-h-[450px]">
            <FloodMap 
              nodes={nodes} 
              selectedNodeId={selectedNodeId} 
              onSelectNode={selectNode} 
            />
          </div>
        </div>
      </section>
    </MapProvider>
  );
}
