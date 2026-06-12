"use client";

import React, { useState, useRef } from "react";
import { Camera, Send, Terminal, Loader2, CheckCircle2, Sparkles } from "lucide-react";

interface ReportItem {
  id: string;
  type: string;
  place: string;
  severity: "normal" | "watch" | "warning" | "critical" | "emergency";
  confidence: number;
  damage: string;
}

interface CommunityReportingProps {
  reports: ReportItem[];
  onNewReport: (report: ReportItem) => void;
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

export default function CommunityReporting({
  reports,
  onNewReport,
  mounted,
  sevColor,
  sevLabel,
}: CommunityReportingProps) {
  const [reportForm, setReportForm] = useState({
    type: "Flood sighting",
    state: "",
    lga: "",
    description: "",
  });

  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "analyzing" | "completed">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setLogs(prev => [
        ...prev,
        "[CDN] Upload complete. Payload hash registered.",
        "[AI] Initializing Gemini 2.5 Flash Vision analyzer...",
        "[AI] Running spatial classification & debris detection maps...",
      ]);
      setUploadState("analyzing");
    }, 1000);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        "[AI] Depth estimation mapping complete.",
        `[AI] Ground-truth reference checks matched for ${reportForm.lga}, ${reportForm.state}`,
        "[AI] Confidence threshold passed (92.4%). Generating situation report...",
      ]);
    }, 2200);

    setTimeout(() => {
      setUploadState("completed");
      const newReportId = `CR-${Math.floor(100 + Math.random() * 900)}`;
      const severityPool: Array<"watch" | "warning" | "critical"> = ["watch", "warning", "critical"];
      const computedSeverity = severityPool[Math.floor(Math.random() * severityPool.length)];

      const newReport: ReportItem = {
        id: newReportId,
        type: reportForm.type,
        place: `${reportForm.lga}, ${reportForm.state}`,
        severity: computedSeverity,
        confidence: +(0.85 + Math.random() * 0.13).toFixed(2),
        damage: computedSeverity === "critical" ? "Severe" : computedSeverity === "warning" ? "Moderate" : "Minor",
      };

      onNewReport(newReport);
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
                {["Flood sighting", "Blocked drainage", "Damaged culvert", "Overflowing river", "Erosion"].map(t => (
                  <option key={t} className="bg-bg-base text-foreground">{t}</option>
                ))}
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
                <div
                  key={idx}
                  className={
                    log.startsWith("[SYSTEM]")
                      ? "text-muted-foreground"
                      : log.startsWith("[CDN]")
                      ? "text-amber-500/80"
                      : log.startsWith("[AI]")
                      ? "text-accent"
                      : "text-emerald-400"
                  }
                >
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
                  <SeverityChip s={r.severity} color={sevColor[r.severity]} label={sevLabel[r.severity]} />
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
  );
}
