import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0 -z-30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hero-bg.jpg"
          alt=""
          width={1920}
          height={1080}
          className="h-full w-full scale-105 object-cover opacity-40 mix-blend-luminosity"
        />
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, oklch(0.13 0.03 240 / 0.65) 55%, var(--background) 100%)",
        }}
      />

      {/* Tech grid */}
      <div
        className="absolute inset-0 -z-20 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(var(--signal) 1px, transparent 1px), linear-gradient(90deg, var(--signal) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Glowing accent */}
      <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-none px-8 text-center">
        {/* Status pill */}
        <div className="hero-anim-pill mb-10 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.06] px-3.5 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/90">
            Sentinel Network — Live across 12 pilot sites
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-[5.25rem]">
          <span className="hero-anim-line1 block">When the river rises,</span>
          <span className="hero-anim-line2 block bg-gradient-to-r from-primary via-[oklch(0.88_0.13_175)] to-accent bg-clip-text text-transparent">
            Nigeria gets the minutes
          </span>
          <span className="hero-anim-line3 block">that save lives.</span>
        </h1>

        {/* Sub */}
        <p className="hero-anim-sub mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          <span className="font-semibold text-foreground">SAFE-NIGERIA</span> is a
          national network of solar-powered Sentinel Nodes that read rivers, rain, and
          soil in real time — delivering ground-truth flood intelligence where
          satellites and cell towers fall short.
        </p>

        {/* CTAs */}
        <div className="hero-anim-cta mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/portal"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.02] hover:opacity-95 active:scale-95"
          >
            Explore the Live Portal
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#solution"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/40 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:bg-secondary active:scale-95"
          >
            See How It Works
          </a>
        </div>

        {/* Trust strip */}
        <div className="hero-anim-trust mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
          <span>Obafemi Awolowo University</span>
          <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
          <span>Built for NEMA · NIHSA · LASEMA</span>
          <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
          <span>Aligned with SDG 11 · 13</span>
        </div>
      </div>

      {/* Floating telemetry card */}
      <div className="hero-anim-card pointer-events-none absolute bottom-10 right-10 z-10 hidden w-64 rounded-2xl border border-border bg-card/60 p-4 shadow-[var(--shadow-elevated)] backdrop-blur-xl lg:block">
        <div className="mb-3 flex items-start justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Lokoja Station 04
          </div>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        </div>
        <div className="font-mono text-2xl font-bold text-foreground">4.82m</div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          Current Water Level ·{" "}
          <span className="text-[color:var(--alert)]">Rising 0.1m/hr</span>
        </div>
        <div className="mt-4 flex h-12 items-end gap-1">
          <div className="h-4 flex-1 rounded-t-sm bg-primary/20" />
          <div className="h-6 flex-1 rounded-t-sm bg-primary/30" />
          <div className="h-8 flex-1 animate-pulse rounded-t-sm bg-primary/50" />
          <div className="h-10 flex-1 rounded-t-sm bg-primary/70" />
          <div className="h-12 flex-1 rounded-t-sm bg-primary" />
        </div>
      </div>
    </section>
  );
}
