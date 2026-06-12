import React from "react";
import { SectionLabel } from "./section-label";
import { Gauge, Radio, Cpu, Satellite, Activity, Shield } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Gauge,
      title: "Ultrasonic Telemetry",
      body: "Storm-proof sensors capturing precise hyper-local water, rain, and soil readings every 30 seconds.",
    },
    {
      icon: Radio,
      title: "LoRa Mesh Network",
      body: "10km+ range. Bypasses mobile networks so the system stays online even when local cell towers fail.",
    },
    {
      icon: Cpu,
      title: "Edge-Logic Processor",
      body: "Gemma-powered edge AI filters noise, detects anomalies, and triggers tiered alerts locally.",
    },
    {
      icon: Satellite,
      title: "Federal Sync",
      body: "Validated alerts are pushed to NEMA, NIHSA, and state agencies through secure APIs.",
    },
    {
      icon: Activity,
      title: "Public Portal",
      body: "Communities, journalists, and NGOs read open real-time data on a public map.",
    },
    {
      icon: Shield,
      title: "Response Coordination",
      body: "Emergency teams receive geo-targeted dispatch packets minutes — not hours — ahead.",
    },
  ];
  return (
    <section id="how" className="mx-auto w-full max-w-[90%] lg:max-w-[75%] py-28">
      <SectionLabel>How It Works</SectionLabel>
      <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
        From a rising river to a routed response, in under five minutes.
      </h2>
      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="group bg-card p-7 transition hover:bg-card/70">
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Network topology diagram */}
      <figure className="mt-16 overflow-hidden rounded-2xl border border-border bg-white p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/network-diagram.png"
          alt="Federal / National data overview — sensor nodes feeding the SAFE-NIGERIA unified command platform"
          loading="lazy"
          className="w-full object-contain"
        />
      </figure>
      <p className="mt-4 text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
        Federal / National data overview · Sentinel mesh → Unified Command Platform
      </p>
    </section>
  );
}
