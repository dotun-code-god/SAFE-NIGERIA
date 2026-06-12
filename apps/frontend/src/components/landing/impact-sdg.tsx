import React from "react";
import { SectionLabel } from "./section-label";
import { HeartPulse, TrendingDown, Users, Building2, Leaf } from "lucide-react";

export function ImpactSDG() {
  const metrics = [
    {
      icon: HeartPulse,
      value: "2.4M",
      label: "Nigerians inside Sentinel alert range across pilot LGAs",
      sub: "Lokoja · Bayelsa · Makurdi · Lagos coastline",
    },
    {
      icon: TrendingDown,
      value: "₦180B",
      label: "Projected annual loss avoidance at national scale",
      sub: "Modeled against 2022–2024 NEMA damage reports",
    },
    {
      icon: Users,
      value: "12 → 774",
      label: "Pilot nodes scaling to every Local Government Area",
      sub: "5-year national deployment roadmap",
    },
  ];

  const sdgs = [
    {
      tag: "SDG 11",
      title: "Sustainable Cities & Communities",
      icon: Building2,
      tint: "from-[oklch(0.78_0.16_65)]/25 to-transparent",
      ring: "ring-[oklch(0.78_0.16_65)]/40",
      body:
        "Hyper-local water-level intelligence hardens drainage, road, and housing decisions across Lagos, Port Harcourt, and Abuja — turning recurring flood zones into managed risk.",
      kpis: [
        { k: "Warning lead time", v: "45–180 min" },
        { k: "Targeted LGAs by 2030", v: "300+" },
        { k: "Open data partners", v: "NEMA · LASEMA · NIHSA" },
      ],
      photo: "/assets/flood-rooftops.jpg",
    },
    {
      tag: "SDG 13",
      title: "Climate Action",
      icon: Leaf,
      tint: "from-primary/25 to-transparent",
      ring: "ring-primary/40",
      body:
        "Continuous rainfall, soil, and river telemetry feeds climate research and adaptive policy across West Africa — a public-good dataset where one barely existed before.",
      kpis: [
        { k: "Telemetry frequency", v: "every 30s" },
        { k: "Data points / node / yr", v: "1.05M" },
        { k: "License", v: "Open · CC-BY" },
      ],
      photo: "/assets/flood-aerial-village.jpg",
    },
  ];

  return (
    <section id="impact" className="relative mx-auto w-full max-w-none px-8 py-28">
      <SectionLabel>Impact</SectionLabel>
      <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
        Lives protected, losses avoided, a dataset where none existed.
      </h2>
      <p className="mt-5 max-w-2xl text-muted-foreground">
        SAFE-NIGERIA is engineered for measurable outcomes — quantified against agency loss
        reports and aligned with the SDGs Nigeria has already committed to.
      </p>

      {/* Quantified metrics */}
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-7"
          >
            <m.icon className="h-5 w-5 text-primary" />
            <div className="mt-5 font-mono text-4xl font-semibold tracking-tight text-foreground">
              {m.value}
            </div>
            <div className="mt-2 text-sm text-foreground/90">{m.label}</div>
            <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              {m.sub}
            </div>
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          </div>
        ))}
      </div>

      {/* SDG alignment with real imagery */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {sdgs.map((s) => (
          <article
            key={s.tag}
            className={`group relative overflow-hidden rounded-3xl border border-border bg-card transition hover:ring-2 ${s.ring}`}
          >
            <div className="relative h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.photo}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${s.tint} via-card/60 to-card`}
              />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground backdrop-blur">
                <s.icon className="h-3 w-3 text-primary" />
                {s.tag}
              </div>
            </div>

            <div className="p-7">
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>

              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5">
                {s.kpis.map((k) => (
                  <div key={k.k}>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {k.k}
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
                      {k.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>

      {/* SDG visual reference */}
      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card/40 p-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          UN Sustainable Development Goals · Direct alignment
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/sdg-icons.png"
          alt="SDG 11 Sustainable Cities and SDG 13 Climate Action"
          className="h-24 w-auto rounded-md bg-white p-2 md:h-28"
        />
      </div>
    </section>
  );
}
