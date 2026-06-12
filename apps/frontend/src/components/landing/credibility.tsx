import React from "react";
import { SectionLabel } from "./section-label";

export function Credibility() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto grid w-full max-w-[90%] lg:max-w-[75%] items-center gap-12 py-24 md:grid-cols-[1.1fr_1fr]">
        <figure className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-elevated)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/launch-lagos.jpg"
            alt="Official launch of the Lagos State Flood resilience programme"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-5 text-[11px] uppercase tracking-widest text-muted-foreground">
            Official launch · Lagos State Flood resilience programme
          </figcaption>
        </figure>

        <div>
          <SectionLabel>Backed by Institutions</SectionLabel>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Already at the table with the people who act on the data.
          </h2>
          <p className="mt-5 text-muted-foreground">
            SAFE-NIGERIA is built in active dialogue with state emergency agencies,
            federal ministries, and university research labs — so every alert lands in a
            workflow that already exists.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {[
              "NEMA — National Emergency Management Agency",
              "NIHSA — Hydrological Services Agency",
              "LASEMA — Lagos State Emergency Management",
              "Obafemi Awolowo University, Ile-Ife",
              "State Ministries of Environment",
              "UN-aligned SDG 11 · 13 reporting",
            ].map((x) => (
              <li
                key={x}
                className="flex items-start gap-2 rounded-lg border border-border bg-background/40 p-3"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span className="text-foreground/90">{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
