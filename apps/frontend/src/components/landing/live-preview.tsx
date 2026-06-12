import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "./section-label";

export function LivePreview() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto grid w-full max-w-none items-center gap-12 px-8 py-24 md:grid-cols-[1fr_1.2fr]">
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

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-elevated)]">
          {/* Faux map */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, oklch(0.78 0.14 195 / 0.3), transparent 40%), radial-gradient(circle at 70% 60%, oklch(0.78 0.16 65 / 0.25), transparent 35%), linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "auto, auto, 32px 32px, 32px 32px",
            }}
          />
          {/* Pins */}
          {[
            { x: "22%", y: "30%", tone: "signal" as const, l: "Lagos" },
            { x: "48%", y: "45%", tone: "alert" as const, l: "Lokoja" },
            { x: "65%", y: "62%", tone: "signal" as const, l: "Makurdi" },
            { x: "30%", y: "68%", tone: "danger" as const, l: "Bayelsa" },
            { x: "78%", y: "32%", tone: "signal" as const, l: "Yola" },
          ].map((p) => (
            <MapPin key={p.l} {...p} />
          ))}
          <div className="absolute bottom-3 left-3 rounded-md border border-border bg-card/80 px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground backdrop-blur">
            12 nodes online · 2 active alerts
          </div>
        </div>
      </div>
    </section>
  );
}

function MapPin({
  x,
  y,
  tone,
  l,
}: {
  x: string;
  y: string;
  tone: "signal" | "alert" | "danger";
  l: string;
}) {
  const c =
    tone === "danger"
      ? "var(--danger)"
      : tone === "alert"
        ? "var(--alert)"
        : "var(--signal)";
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <span
        className="absolute -left-3 -top-3 h-6 w-6 animate-ping rounded-full opacity-50"
        style={{ background: c }}
      />
      <span
        className="relative block h-2.5 w-2.5 rounded-full ring-2 ring-background"
        style={{ background: c }}
      />
      <span className="absolute left-4 top-[-4px] whitespace-nowrap rounded bg-card/80 px-1.5 py-0.5 text-[10px] text-foreground backdrop-blur">
        {l}
      </span>
    </div>
  );
}
