"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "./section-label";

export function ProblemSection() {
  const gaps = [
    {
      n: "01",
      tag: "Scale Gap",
      body: "National-scale flood unpredictability leaves millions at risk with no reliable forecasting infrastructure.",
    },
    {
      n: "02",
      tag: "Data Gap",
      body: "Local communities remain vulnerable without access to real-time water-level data from the rivers around them.",
    },
    {
      n: "03",
      tag: "Response Gap",
      body: "A critical disconnect between early detection and the agencies who need to act on it within minutes.",
    },
  ];

  return (
    <section id="problem" className="mx-auto w-full max-w-[90%] lg:max-w-[75%] py-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionLabel>The Problem</SectionLabel>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          Floods don't wait for paperwork — and neither should warnings.
        </h2>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Africa loses an estimated <span className="text-foreground font-semibold">$12.7B</span> annually to
          disasters; flooding alone accounts for nearly 70% of it. Yet most at-risk communities
          still rely on satellite snapshots and rumor.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {gaps.map((g, idx) => (
            <motion.div
              key={g.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:border-primary/40"
            >
              <div className="font-mono text-xs text-primary">{g.n}</div>
              <div className="mt-2 text-lg font-semibold">{g.tag}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{g.body}</p>
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* Evidence strip — real flood photography */}
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {[
            {
              src: "/assets/flood-aerial-village.jpg",
              cap: "Riverine community submerged after a single overnight surge — Northern Nigeria, 2024.",
            },
            {
              src: "/assets/flood-rooftops.jpg",
              cap: "Aerial survey: dense settlements cut off from road and grid access within hours.",
            },
          ].map((p, idx) => (
            <motion.figure
              key={p.src}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.cap}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-5">
                <figcaption className="text-xs text-muted-foreground">{p.cap}</figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
