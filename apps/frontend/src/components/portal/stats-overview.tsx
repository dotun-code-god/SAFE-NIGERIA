"use client";

import React from "react";
import { Radio, AlertTriangle, CloudRain, Droplets, Shield } from "lucide-react";

interface StatsOverviewProps {
  total: number;
  online: number;
  critical: number;
}

function Stat({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  delta, 
  hoverColor = "bg-emerald-500" 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  unit?: string; 
  delta?: string; 
  hoverColor?: string 
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-card/40 backdrop-blur-md p-5 transition-all duration-300 hover:border-emerald-500/40 hover:bg-card/60 shadow-lg">
      {/* Carbon fibre subtle texture overlay inside the card */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)",
          backgroundSize: "4px 4px",
        }} 
      />
      
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[10px] uppercase tracking-widest font-mono font-medium">{label}</span>
        <Icon className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
      </div>
      
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-mono font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors duration-300">
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground font-mono">{unit}</span>}
      </div>
      
      {delta && (
        <div className="mt-2 text-[10px] text-emerald-400/90 font-mono flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {delta}
        </div>
      )}
      
      {/* Bottom sweep hover animation color bar */}
      <div className={`absolute bottom-0 left-0 h-[3px] w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out ${hoverColor}`} />
    </div>
  );
}

export default function StatsOverview({ total, online, critical }: StatsOverviewProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#0B0F19]/80 p-8 md:p-12 shadow-[var(--shadow-elevated)]">
      {/* Backdrop Image */}
      <div className="absolute inset-0 -z-30 pointer-events-none opacity-40 mix-blend-luminosity">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/cyber-sentinel-dark-glass.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Carbon-fibre texture overlay for tactical depth */}
      <div 
        className="absolute inset-0 -z-20 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(45deg, #000 25%, transparent 25%), 
            linear-gradient(-45deg, #000 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #000 75%), 
            linear-gradient(-45deg, transparent 75%, #000 75%)
          `,
          backgroundSize: "6px 6px",
          backgroundPosition: "0 0, 3px 0, 3px -3px, 0px -3px"
        }}
      />

      {/* Ambient blurred mesh background (emerald + blue blobs) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-[300px] w-[300px] rounded-full bg-emerald-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -right-1/4 -bottom-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute left-1/3 top-1/2 h-[200px] w-[200px] rounded-full bg-blue-500/10 blur-[80px]" />
      </div>

      {/* Hero Header Content */}
      <div className="relative z-10 mb-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-4xl">
          {/* Tagline */}
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            // LIVE CYBER-SENTINEL TELEMETRY
          </div>
          
          {/* Heavy 7xl extrabold headline with emerald->cyan gradient text */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl leading-[1.05] font-display">
            Real-time flood intelligence for <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">every Nigerian community</span>.
          </h1>
          
          <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground">
            Distributed solar-powered sentinel nodes stream water level, rainfall and soil saturation data.
            AI-assisted models forecast risk windows from one hour to three days ahead.
          </p>
        </div>

        {/* Compact pill network status with glowing emerald dot */}
        <div className="self-start lg:self-auto shrink-0 flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-4 py-2 text-xs font-mono text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)] backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-emerald-400/90 font-medium">Network:</span>
          <span className="text-white font-bold">{online}/{total} nodes online</span>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
        <Stat 
          icon={Radio} 
          label="Sentinel nodes" 
          value={String(total)} 
          unit="active" 
          delta={`+3 deployed this week`} 
          hoverColor="bg-emerald-500"
        />
        <Stat 
          icon={AlertTriangle} 
          label="Critical alerts" 
          value={String(critical)} 
          unit="now" 
          hoverColor="bg-red-500"
          delta={critical > 0 ? `${critical} active alert zones` : undefined}
        />
        <Stat 
          icon={CloudRain} 
          label="Rainfall (24h)" 
          value="148" 
          unit="mm avg" 
          delta="↑ 12% vs yesterday" 
          hoverColor="bg-cyan-500"
        />
        <Stat 
          icon={Droplets} 
          label="Avg water level" 
          value="5.3" 
          unit="m" 
          delta="↑ 0.22m / 6h" 
          hoverColor="bg-teal-500"
        />
        <Stat 
          icon={Shield} 
          label="People covered" 
          value="42.1M" 
          unit="active"
          delta="Across 17 states"
          hoverColor="bg-blue-500"
        />
      </div>
    </section>
  );
}
