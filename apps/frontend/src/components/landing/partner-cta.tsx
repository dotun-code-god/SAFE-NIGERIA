"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function PartnerCTA() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="mx-auto w-full max-w-[90%] lg:max-w-[75%] py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Partner with us to put a Sentinel on every river.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            We're working with state agencies, federal ministries, and infrastructure
            operators to scale SAFE-NIGERIA from pilot to national coverage.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:dotun494@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
            >
              Request a Partnership Brief
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3.5 text-sm font-medium backdrop-blur transition hover:bg-secondary"
            >
              View Live Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
