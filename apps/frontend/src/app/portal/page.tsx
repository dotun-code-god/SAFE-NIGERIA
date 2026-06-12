"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MapProvider, useMap } from "react-map-gl/mapbox";
import { useTelemetryNodes, TelemetryNode } from "@/hooks/use-telemetry-nodes";
import {
  Activity, AlertTriangle, ArrowUpRight, Battery, Camera, CloudRain,
  Droplets, Gauge, MapPin, Radio, Send, Shield, Signal, Waves, Wind, Zap, CheckCircle2, Loader2, Sparkles, Terminal
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

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

// ---------- helpers ----------
const sevColor: Record<Severity | "safe", string> = {
  safe: "var(--color-alert-normal)",
  normal: "var(--color-alert-normal)",
  watch: "var(--color-alert-watch)",
  warning: "var(--color-alert-warning)",
  critical: "var(--color-alert-critical)",
  emergency: "var(--color-alert-emergency)",
};

const sevLabel: Record<Severity | "safe", string> = {
  safe: "Safe",
  normal: "Safe",
  watch: "Watch",
  warning: "Warning",
  critical: "Critical",
  emergency: "Emergency",
};

function SeverityChip({ s }: { s: Severity }) {
  const color = sevColor[s] || "var(--color-alert-normal)";
  const label = sevLabel[s] || "Safe";
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

  // Community Reports State
  const [reports, setReports] = useState(initialCommunityReports);
  const [reportForm, setReportForm] = useState({
    type: "Flood sighting",
    state: "",
    lga: "",
    description: "",
  });
  
  // Gemini Vision AI upload simulation
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "analyzing" | "completed">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle report file uploader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadState("idle");
    }
  };

  const simulateVisionAI = () => {
    if (!reportForm.state || !reportForm.lga) {
      alert("Please enter State and LGA details first.");
      return;
    }
    
    setUploadState("uploading");
    setLogs(["[SYSTEM] Initiating report upload...", "[CDN] Handshaking secure storage tunnel..."]);
    
    setTimeout(() => {
      setLogs(prev => [...prev, "[CDN] Upload complete. Payload hash registered.", "[AI] Initializing Gemini 2.5 Flash Vision analyzer...", "[AI] Running spatial classification & debris detection maps..."]);
      setUploadState("analyzing");
    }, 1000);

    setTimeout(() => {
      setLogs(prev => [...prev, "[AI] Depth estimation mapping complete.", `[AI] Ground-truth reference checks matched for ${reportForm.lga}, ${reportForm.state}`, "[AI] Confidence threshold passed (92.4%). Generating situation report..."]);
    }, 2200);

    setTimeout(() => {
      setUploadState("completed");
      const newReportId = `CR-${Math.floor(100 + Math.random() * 900)}`;
      const severityPool: Severity[] = ["watch", "warning", "critical"];
      const computedSeverity = severityPool[Math.floor(Math.random() * severityPool.length)];
      
      const newReport = {
        id: newReportId,
        type: reportForm.type,
        place: `${reportForm.lga}, ${reportForm.state}`,
        severity: computedSeverity,
        confidence: +(0.85 + Math.random() * 0.13).toFixed(2),
        damage: computedSeverity === "critical" ? "Severe" : computedSeverity === "warning" ? "Moderate" : "Minor",
      };
      
      setReports(prev => [newReport, ...prev]);
    }, 3800);
  };

  const resetUploader = () => {
    setUploadState("idle");
    setFileName(null);
    setPreviewUrl(null);
    setLogs([]);
    setReportForm({
      type: "Flood sighting",
      state: "",
      lga: "",
      description: "",
    });
  };

  return (
    <MapProvider>
      <div className="min-h-screen bg-bg-base text-[#ededed]">
        {/* Map Controller Context Consumer */}
        <MapController selectedNodeId={selectedNodeId} nodes={nodes} />

        {/* top nav */}
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
              {[...alertsFeed, ...alertsFeed].map((a, i) => (
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

        <main className="mx-auto w-full space-y-12 px-6 py-10">
          {/* HERO STATS */}
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
                <span className="text-foreground">{summary.online}/{summary.total} nodes online</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <Stat icon={Radio} label="Sentinel nodes" value={String(summary.total)} unit="active" delta={`+3 deployed this week`} />
              <Stat icon={AlertTriangle} label="Critical alerts" value={String(summary.critical)} unit="now" />
              <Stat icon={CloudRain} label="Rainfall (24h)" value="148" unit="mm avg" delta="↑ 12% vs yesterday" />
              <Stat icon={Droplets} label="Avg water level" value="5.3" unit="m" delta="↑ 0.22m / 6h" />
              <Stat icon={Shield} label="People covered" value="42.1M" unit="across 17 states" />
            </div>
          </section>

          {/* MAP & selected node card */}
          <section id="map" className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col h-full">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">Interactive flood map</h2>
                  <p className="text-xs text-muted-foreground">Click a sentinel node to inspect live readings.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  {(["normal", "watch", "warning", "critical"] as Severity[]).map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sevColor[s] }} />
                      {sevLabel[s]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mapbox Integration replacing static SVG silhouette */}
              <div className="relative aspect-[4/3] w-full flex-grow overflow-hidden rounded-lg border border-border bg-[#0B0F19] grid-bg min-h-[350px] md:min-h-[450px]">
                <FloodMap 
                  nodes={nodes} 
                  selectedNodeId={selectedNodeId} 
                  onSelectNode={selectNode} 
                />
              </div>
            </div>

            {/* selected node */}
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{selected?.id || "SN-NONE"}</div>
                    <h3 className="text-lg font-semibold">{selected?.name || "No Node Selected"}</h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {selected?.lga || "LGA"}, {selected?.state || "State"}
                    </p>
                  </div>
                  {selected && <SeverityChip s={selected.status} />}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md border border-border bg-background/40 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"><Gauge className="h-3 w-3" /> Water level</div>
                    <div className="mt-1 font-mono text-2xl">{(selected?.waterLevel || 0).toFixed(2)}<span className="text-xs text-muted-foreground"> m</span></div>
                    <div className="text-[11px] text-accent font-mono">
                      {selected && selected.waterRiseRate >= 0 ? "↑" : "↓"} {Math.abs(selected?.waterRiseRate || 0).toFixed(2)} m/h
                    </div>
                  </div>
                  <div className="rounded-md border border-border bg-background/40 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"><CloudRain className="h-3 w-3" /> Rainfall 6h</div>
                    <div className="mt-1 font-mono text-2xl">{Math.abs((selected?.waterRiseRate || 0) * 90).toFixed(0)}<span className="text-xs text-muted-foreground"> mm</span></div>
                    <div className="text-[11px] text-muted-foreground font-mono">Above seasonal avg</div>
                  </div>
                  <div className="rounded-md border border-border bg-background/40 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"><Battery className="h-3 w-3" /> Battery</div>
                    <div className="mt-1 font-mono text-2xl">{selected?.batteryHealth || 0}%</div>
                    <div className="h-1.5 mt-2 rounded-full bg-background overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${selected?.batteryHealth || 0}%` }} />
                    </div>
                  </div>
                  <div className="rounded-md border border-border bg-background/40 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"><Signal className="h-3 w-3" /> LoRa signal</div>
                    <div className="mt-1 font-mono text-2xl">{selected?.signalStrength || 0}%</div>
                    <div className="h-1.5 mt-2 rounded-full bg-background overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${selected?.signalStrength || 0}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-md border border-dashed border-accent/30 bg-accent/5 p-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent font-mono">
                    <Zap className="h-3 w-3 animate-pulse" /> Edge AI · Gemma
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                    Anomaly score <span className="font-mono text-accent">{(selected?.waterLevel || 0) > 6.0 ? "0.73" : "0.18"}</span>. 
                    {selected?.waterRiseRate && selected.waterRiseRate > 0.1 
                      ? " Sustained upward water trend consistent with upstream rainfall pattern. False-alert probability low." 
                      : " Node reports normal cyclical patterns. Stable atmospheric boundary."}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Last report:</span>
                <span>{mounted && selected ? new Date(selected.lastReported).toLocaleTimeString() : "--:--:--"}</span>
              </div>
            </div>
          </section>

          {/* DASHBOARD */}
          <section id="dashboard" className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Water level & rainfall · last 24h</h2>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{selected?.name || "Selected node"}</div>
              </div>
              <div className="h-72 w-full min-w-0 relative">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={selectedWaterTrend}>
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
              <p className="text-xs text-muted-foreground">AI predictive model · region: {selected?.state} Basin</p>
              <div className="mt-4 space-y-3">
                {selectedRiskForecast.map(r => {
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
                  Water levels across <span className="text-foreground font-semibold">{selected?.state}</span> increased by 
                  {(selected?.waterRiseRate * 6 * 100).toFixed(0)}% during the last six hours, creating risk markers in downstream monitored zones.
                </p>
              </div>
            </div>
          </section>

          {/* ALERTS */}
          <section id="alerts" className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Public alerts feed</h2>
                  <p className="text-xs text-muted-foreground">Broadcast via SMS, WhatsApp, email & push.</p>
                </div>
                <span className="rounded-full border border-border bg-background/40 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {alertsFeed.length} active
                </span>
              </div>
              <ul className="divide-y divide-border">
                {alertsFeed.map(a => (
                  <li key={a.id} className="flex items-start gap-4 py-3">
                    <div
                      className="mt-1 h-8 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: sevColor[a.severity] }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <SeverityChip s={a.severity} />
                        <span className="font-mono text-[10px] text-muted-foreground">{a.id}</span>
                      </div>
                      <div className="mt-1 text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.place} · {a.ago}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-accent cursor-pointer" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Notification routing</h2>
              <p className="text-xs text-muted-foreground">Multi-channel escalation by stakeholder</p>
              <div className="mt-4 space-y-2 text-sm">
                {[
                  { who: "Citizens", how: "SMS", icon: Send },
                  { who: "Community leaders", how: "SMS + Email", icon: Activity },
                  { who: "State agencies (SEMA)", how: "Dashboard + Email", icon: Shield },
                  { who: "Federal (NEMA / NIHSA)", how: "Dashboard + Escalation", icon: AlertTriangle },
                ].map(r => (
                  <div key={r.who} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <r.icon className="h-4 w-4 text-accent" />
                      <span>{r.who}</span>
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">{r.how}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] font-mono uppercase tracking-widest">
                {(["normal", "watch", "warning", "critical"] as Severity[]).map(s => (
                  <div key={s} className="rounded-md border border-border p-2 font-semibold" style={{ color: sevColor[s] }}>
                    {sevLabel[s]}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ANALYTICS */}
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

          {/* COMMUNITY REPORTING & SIMULATED UPLOADER */}
          <section id="report" className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">Report a flood incident</h2>
                <p className="text-xs text-muted-foreground">Help us verify ground conditions. Analyzed by Gemini Vision AI.</p>
                
                <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Incident type</label>
                    <select 
                      value={reportForm.type}
                      onChange={(e) => setReportForm(prev => ({ ...prev, type: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-bg-base px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      {["Flood sighting", "Blocked drainage", "Damaged culvert", "Overflowing river", "Erosion"].map(t => <option key={t} className="bg-bg-base text-foreground">{t}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">State</label>
                      <input 
                        value={reportForm.state}
                        onChange={(e) => setReportForm(prev => ({ ...prev, state: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-border bg-bg-base px-3 py-2 text-sm text-foreground placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-accent" 
                        placeholder="e.g. Kogi" 
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">LGA</label>
                      <input 
                        value={reportForm.lga}
                        onChange={(e) => setReportForm(prev => ({ ...prev, lga: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-border bg-bg-base px-3 py-2 text-sm text-foreground placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-accent" 
                        placeholder="e.g. Lokoja" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Description</label>
                    <textarea 
                      rows={3} 
                      value={reportForm.description}
                      onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-bg-base px-3 py-2 text-sm text-foreground placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-accent" 
                      placeholder="What did you see?" 
                    />
                  </div>
                  
                  {/* File Selector */}
                  <div className="flex flex-col gap-2 rounded-md border border-dashed border-border bg-bg-base/30 p-3 text-xs">
                    <input 
                      type="file" 
                      accept="image/*,video/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground font-mono">
                        <Camera className="h-4 w-4" /> 
                        {fileName ? <span className="text-accent max-w-[150px] truncate">{fileName}</span> : "Attach photo (GPS auto-tagged)"}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-md border border-border px-2.5 py-1 text-[11px] hover:bg-muted font-mono"
                      >
                        {fileName ? "Change" : "Browse"}
                      </button>
                    </div>

                    {previewUrl && (
                      <div className="relative mt-2 aspect-video w-full rounded-md overflow-hidden border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Upload preview" className="object-cover w-full h-full" />
                      </div>
                    )}
                  </div>

                  {uploadState === "idle" && (
                    <button 
                      onClick={simulateVisionAI}
                      disabled={!fileName}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-bg-base hover:bg-accent/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Send className="h-4 w-4" /> Submit report
                    </button>
                  )}
                </form>
              </div>

              {/* simulated console log output */}
              {uploadState !== "idle" && (
                <div className="mt-4 border border-border bg-bg-base rounded-lg p-3 text-[11px] font-mono flex flex-col gap-1.5 min-h-[160px] justify-between">
                  <div className="flex items-center justify-between border-b border-border pb-1 text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Gemini Vision Log</span>
                    {uploadState !== "completed" && <Loader2 className="w-3 h-3 animate-spin text-accent" />}
                  </div>
                  <div className="flex-grow flex flex-col gap-1 overflow-y-auto max-h-[120px] scrollbar-none py-1">
                    {logs.map((log, idx) => (
                      <div key={idx} className={log.startsWith("[SYSTEM]") ? "text-muted-foreground" : log.startsWith("[CDN]") ? "text-amber-500/80" : log.startsWith("[AI]") ? "text-accent" : "text-emerald-400"}>
                        {log}
                      </div>
                    ))}
                  </div>
                  {uploadState === "completed" && (
                    <div className="border-t border-border pt-1.5 flex items-center justify-between">
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Incident registered</span>
                      <button onClick={resetUploader} className="text-[10px] text-accent hover:underline uppercase tracking-wider">Reset Form</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent community reports</h2>
                  <span className="rounded-full border border-border bg-background/40 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-accent flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Gemini verified
                  </span>
                </div>
                <ul className="mt-4 space-y-3 overflow-y-auto max-h-[420px] pr-1">
                  {reports.map(r => (
                    <li key={r.id} className="rounded-lg border border-border bg-background/40 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.id}</div>
                          <div className="mt-0.5 font-semibold">{r.type}</div>
                          <div className="text-xs text-muted-foreground">{r.place}</div>
                        </div>
                        <SeverityChip s={r.severity} />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <div className="rounded-md border border-border bg-card p-2">
                          <div className="text-muted-foreground text-[10px]">Severity</div>
                          <div style={{ color: sevColor[r.severity] }} className="font-bold">{sevLabel[r.severity]}</div>
                        </div>
                        <div className="rounded-md border border-border bg-card p-2">
                          <div className="text-muted-foreground text-[10px]">Confidence</div>
                          <div className="font-bold text-accent">{(r.confidence * 100).toFixed(0)}%</div>
                        </div>
                        <div className="rounded-md border border-border bg-card p-2">
                          <div className="text-muted-foreground text-[10px]">Damage</div>
                          <div className="font-bold text-foreground">{r.damage}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FOOTER */}
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
