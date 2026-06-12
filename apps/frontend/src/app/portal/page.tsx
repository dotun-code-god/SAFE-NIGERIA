"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MapProvider, useMap } from "react-map-gl/mapbox";
import { useTelemetryNodes, TelemetryNode } from "@/hooks/use-telemetry-nodes";
import { Wind } from "lucide-react";

// Import modular sub-components
import PortalHeader from "@/components/portal/portal-header";
import StatsOverview from "@/components/portal/stats-overview";
import NodeDetailsCard from "@/components/portal/node-details-card";
import TelemetryCharts from "@/components/portal/telemetry-charts";
import AnalyticsCharts from "@/components/portal/analytics-charts";
import CommunityReporting from "@/components/portal/community-reporting";

// Dynamically import Mapbox canvas component with SSR disabled
const FloodMap = dynamic(() => import("@/components/portal/flood-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-bg-base flex items-center justify-center font-mono text-xs text-white/40">
      Initializing WebGL Canvas...
    </div>
  ),
});

// ---------- mock data ----------
type Severity = "normal" | "watch" | "warning" | "critical" | "emergency";

const alertsFeed: Array<{ id: string; severity: Severity; title: string; place: string; ago: string }> = [
  { id: "A-2031", severity: "critical", title: "Rapid water rise (+42cm/hr)", place: "Lokoja, Kogi", ago: "4 min ago" },
  { id: "A-2030", severity: "warning", title: "Sustained rainfall >35mm", place: "Makurdi, Benue", ago: "22 min ago" },
  { id: "A-2029", severity: "warning", title: "Delta tributary overflow overflow", place: "Onitsha, Anambra", ago: "1 hr ago" },
  { id: "A-2028", severity: "watch", title: "Soil saturation threshold reached", place: "Yenagoa, Bayelsa", ago: "2 hr ago" },
  { id: "A-2027", severity: "normal", title: "Incident resolved · drainage cleared", place: "Eti-Osa, Lagos", ago: "5 hr ago" },
];

const historicalIncidents = [
  { year: "2019", incidents: 142, displaced: 210 },
  { year: "2020", incidents: 188, displaced: 312 },
  { year: "2021", incidents: 167, displaced: 268 },
  { year: "2022", incidents: 264, displaced: 1430 },
  { year: "2023", incidents: 221, displaced: 894 },
  { year: "2024", incidents: 248, displaced: 1102 },
  { year: "2025", incidents: 196, displaced: 612 },
];

const initialCommunityReports = [
  { id: "CR-882", type: "Blocked drainage", place: "Surulere, Lagos", severity: "warning" as Severity, confidence: 0.91, damage: "Moderate" },
  { id: "CR-881", type: "Overflowing river", place: "Adankolo, Kogi", severity: "critical" as Severity, confidence: 0.96, damage: "Severe" },
  { id: "CR-880", type: "Damaged culvert", place: "Wuse, FCT", severity: "watch" as Severity, confidence: 0.78, damage: "Minor" },
];

// ---------- color styles mapping ----------
const sevColor: Record<string, string> = {
  safe: "var(--color-alert-normal)",
  normal: "var(--color-alert-normal)",
  watch: "var(--color-alert-watch)",
  warning: "var(--color-alert-warning)",
  critical: "var(--color-alert-critical)",
  emergency: "var(--color-alert-emergency)",
};

const sevLabel: Record<string, string> = {
  safe: "Safe",
  normal: "Safe",
  watch: "Watch",
  warning: "Warning",
  critical: "Critical",
  emergency: "Emergency",
};

// Camera control helper
function MapController({ 
  selectedNodeId, 
  nodes 
}: { 
  selectedNodeId: string | null; 
  nodes: TelemetryNode[]; 
}) {
  const { portalMap } = useMap();

  useEffect(() => {
    if (selectedNodeId && portalMap) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        portalMap.flyTo({
          center: [node.longitude, node.latitude],
          zoom: 8.5,
          duration: 2000,
          essential: true,
        });
      }
    }
  }, [selectedNodeId, nodes, portalMap]);

  return null;
}

export default function PortalPage() {
  const { nodes, selectedNodeId, selectNode } = useTelemetryNodes();
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [reports, setReports] = useState(initialCommunityReports);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const summary = useMemo(() => {
    const total = nodes.length;
    const online = nodes.filter(n => n.signalStrength > 30).length;
    const critical = nodes.filter(n => n.status === "critical" || n.status === "emergency").length;
    const warning = nodes.filter(n => n.status === "warning").length;
    return { total, online, critical, warning };
  }, [nodes]);

  const selected = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  // Generate water level trend dynamically based on selection
  const selectedWaterTrend = useMemo(() => {
    const baseLevel = selected?.waterLevel || 5.0;
    const trendRate = selected?.waterRiseRate || 0.1;
    return Array.from({ length: 24 }, (_, i) => {
      const hourOffset = i - 23;
      const wave = Math.sin(i / 3) * 0.4;
      const levelVal = baseLevel + (hourOffset * trendRate * 0.5) + wave + Math.sin(i * 1.5) * 0.05;
      const rainVal = Math.max(0, Math.sin(i / 2.5) * 5 + trendRate * 10 + Math.cos(i) * 0.5);
      return {
        t: `${String(i).padStart(2, "0")}:00`,
        level: +Math.max(0.5, levelVal).toFixed(2),
        rain: +rainVal.toFixed(1),
      };
    });
  }, [selected]);

  // Generate risk forecast dynamically based on selection
  const selectedRiskForecast = useMemo(() => {
    const baseRisk = selected?.status === "critical" || selected?.status === "emergency" ? 82 
      : selected?.status === "warning" ? 65 
      : selected?.status === "watch" ? 42 
      : 18;
    return [
      { window: "1h", risk: Math.min(100, Math.max(5, Math.round(baseRisk + (selected?.waterRiseRate || 0.1) * 25))) },
      { window: "6h", risk: Math.min(100, Math.max(5, Math.round(baseRisk + (selected?.waterRiseRate || 0.1) * 35))) },
      { window: "24h", risk: Math.min(100, Math.max(5, Math.round(baseRisk + (selected?.waterRiseRate || 0.1) * 10))) },
      { window: "72h", risk: Math.min(100, Math.max(5, Math.round(baseRisk - (selected?.waterRiseRate || 0.1) * 12))) },
    ];
  }, [selected]);

  return (
    <MapProvider>
      <div className="min-h-screen bg-bg-base text-[#ededed]">
        {/* Map Controller Context Consumer */}
        <MapController selectedNodeId={selectedNodeId} nodes={nodes} />

        {/* 1. Header Navigation */}
        <PortalHeader now={now} mounted={mounted} alerts={alertsFeed} sevColor={sevColor} />

        <main className="mx-auto w-full space-y-12 px-6 py-10">
          {/* 2. Hero Statistics Summary */}
          <StatsOverview total={summary.total} online={summary.online} critical={summary.critical} />

          {/* 3. Interactive Map & Selected Node Card */}
          <section id="map" className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col h-full">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">Interactive flood map</h2>
                  <p className="text-xs text-muted-foreground">Click a sentinel node to inspect live readings.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  {["normal", "watch", "warning", "critical"].map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sevColor[s] }} />
                      {sevLabel[s]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mapbox Canvas Wrapper */}
              <div className="relative aspect-[4/3] w-full flex-grow overflow-hidden rounded-lg border border-border bg-[#0B0F19] grid-bg min-h-[350px] md:min-h-[450px]">
                <FloodMap 
                  nodes={nodes} 
                  selectedNodeId={selectedNodeId} 
                  onSelectNode={selectNode} 
                />
              </div>
            </div>

            {/* Selected Node Details Panel */}
            <NodeDetailsCard selected={selected} mounted={mounted} sevColor={sevColor} sevLabel={sevLabel} />
          </section>

          {/* 4. Sensor Telemetry Charts */}
          <TelemetryCharts
            waterTrend={selectedWaterTrend}
            riskForecast={selectedRiskForecast}
            selectedNodeName={selected?.name || "Selected node"}
            selectedState={selected?.state || "State"}
            waterRiseRate={selected?.waterRiseRate || 0}
            mounted={mounted}
            sevColor={sevColor}
          />

          {/* 5. Historical Incidents & Displacement Analytics */}
          <AnalyticsCharts historicalIncidents={historicalIncidents} mounted={mounted} />

          {/* 6. Community Sighting Form & Verified Feed */}
          <CommunityReporting
            reports={reports}
            onNewReport={(newReport) => setReports(prev => [newReport, ...prev])}
            mounted={mounted}
            sevColor={sevColor}
            sevLabel={sevLabel}
          />

          {/* Footer */}
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-mono uppercase tracking-widest">
              <Wind className="h-3 w-3" /> SAFE-NIGERIA · Obafemi Awolowo University
            </div>
            <div className="font-mono">Data refreshed every 60s · Prototype build</div>
          </footer>
        </main>
      </div>
    </MapProvider>
  );
}
