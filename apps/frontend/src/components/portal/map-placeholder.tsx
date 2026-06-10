"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MapPlaceholder() {
  // Mock node coordinates relative to screen to simulate map stations
  const mockNodes = [
    { id: 1, x: "25%", y: "30%", status: "critical", label: "Lokoja Node (LK-01)" },
    { id: 2, x: "65%", y: "45%", status: "warning", label: "Makurdi Node (MK-02)" },
    { id: 3, x: "40%", y: "70%", status: "normal", label: "Yenagoa Node (YG-04)" },
    { id: 4, x: "80%", y: "25%", status: "watch", label: "Kiri Dam Node (KD-03)" },
  ];

  const getAlertColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-alert-critical";
      case "warning":
        return "bg-alert-warning";
      case "watch":
        return "bg-alert-watch";
      default:
        return "bg-alert-normal";
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-bg-base z-0">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #38BDF8 1px, transparent 1px),
            linear-gradient(to bottom, #38BDF8 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      
      {/* Radial glow centered */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)]" />

      {/* Grid Coordinates (Telemetry Style) */}
      <div className="absolute bottom-4 right-4 font-mono text-xs text-white/30 space-y-1 select-none pointer-events-none hidden md:block">
        <div>SYS_LOC: 9.0820° N, 8.6753° E</div>
        <div>MAP_SCALE: 1 : 25,000</div>
        <div>RENDER_ENGINE: WEBGL_STAGE_0</div>
      </div>

      {/* Compass/Reticle UI in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none">
        <svg width="200" height="200" viewBox="0 0 200 200" className="animate-spin-slow">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="40 10" />
          <path d="M 100 0 L 100 200 M 0 100 L 200 100" stroke="#38BDF8" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Simulated Map Nodes */}
      {mockNodes.map((node) => (
        <div
          key={node.id}
          className="absolute cursor-pointer group"
          style={{ left: node.x, top: node.y }}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing halo */}
            <motion.div
              className={`absolute w-8 h-8 rounded-full ${getAlertColor(node.status)} opacity-25`}
              animate={{ scale: [1, 2, 1], opacity: [0.25, 0.05, 0.25] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            {/* Core dot */}
            <div className={`w-3 h-3 rounded-full ${getAlertColor(node.status)} shadow-[0_0_8px_rgba(56,189,248,0.5)] z-10`} />
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-bg-surface/90 border border-white/10 text-[10px] font-mono px-2 py-1 rounded shadow-xl text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
              {node.label} <span className="uppercase text-white/50">({node.status})</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
