"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TelemetryNode } from "@/hooks/use-telemetry-nodes";
import { 
  Activity, Shield, AlertTriangle, CloudRain, Upload, MapPin, 
  ChevronRight, Battery, Radio, TrendingUp, TrendingDown, ArrowLeft 
} from "lucide-react";

interface DesktopSidebarProps {
  nodes: TelemetryNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
}

// Inline custom SVG Area Chart to represent water level trends
function NodeChart({ node }: { node: TelemetryNode }) {
  const data = [
    node.waterLevel - 0.4,
    node.waterLevel - 0.2,
    node.waterLevel - 0.1,
    node.waterLevel - 0.15,
    node.waterLevel - 0.05,
    node.waterLevel,
  ];

  const maxLevel = Math.max(...data, node.criticalThreshold) + 0.5;
  const minLevel = Math.max(0, Math.min(...data) - 0.5);

  const getPointsPath = () => {
    const width = 360;
    const height = 80;
    const padding = 10;
    const usableHeight = height - padding * 2;
    const usableWidth = width - padding * 2;

    const points = data.map((val, index) => {
      const x = padding + (index / (data.length - 1)) * usableWidth;
      const y = height - padding - ((val - minLevel) / (maxLevel - minLevel)) * usableHeight;
      return `${x},${y}`;
    });

    const linePath = `M ${points.join(" L ")}`;
    const fillPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;

    return { linePath, fillPath };
  };

  const { linePath, fillPath } = getPointsPath();

  const getChartColor = () => {
    switch (node.status) {
      case "emergency":
      case "critical":
        return "#EF4444";
      case "warning":
        return "#F97316";
      case "watch":
        return "#F59E0B";
      default:
        return "#10B981";
    }
  };

  const chartColor = getChartColor();

  return (
    <div className="mt-3">
      <div className="flex justify-between text-[8px] font-mono text-white/40 mb-1 select-none">
        <span>-6 Hours</span>
        <span>-3 Hours</span>
        <span>Real-time</span>
      </div>
      <div className="relative bg-white/[0.01] border border-white/5 rounded p-1 overflow-hidden h-[90px]">
        <svg viewBox="0 0 360 80" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`grad-${node.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Critical Threshold line */}
          {node.criticalThreshold < maxLevel && (
            <line
              x1="0"
              y1={80 - 10 - ((node.criticalThreshold - minLevel) / (maxLevel - minLevel)) * 60}
              x2="360"
              y2={80 - 10 - ((node.criticalThreshold - minLevel) / (maxLevel - minLevel)) * 60}
              stroke="#EF4444"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          )}

          {/* Area fill */}
          <path d={fillPath} fill={`url(#grad-${node.id})`} />

          {/* Trend line */}
          <path d={linePath} fill="none" stroke={chartColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {data.map((val, index) => {
            const width = 360;
            const padding = 10;
            const usableWidth = width - padding * 2;
            const x = padding + (index / (data.length - 1)) * usableWidth;
            const y = 80 - padding - ((val - minLevel) / (maxLevel - minLevel)) * 60;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={index === data.length - 1 ? 3 : 1.5}
                fill={index === data.length - 1 ? chartColor : "#ffffff"}
                stroke={chartColor}
                strokeWidth={index === data.length - 1 ? 1 : 0}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function DesktopSidebar({ nodes = [], selectedNodeId, onSelectNode }: DesktopSidebarProps) {
  const [lastSelectedNode, setLastSelectedNode] = React.useState<TelemetryNode | null>(null);

  // Compute risk summary metrics dynamically
  const activeWarnings = (nodes || []).filter((n) => n.status === "critical" || n.status === "emergency").length;
  const watchAreas = (nodes || []).filter((n) => n.status === "watch" || n.status === "warning").length;
  const activeNodes = (nodes || []).filter((n) => n.batteryHealth > 0).length;

  const selectedNode = (nodes || []).find((n) => n.id === selectedNodeId) || null;

  // Cache the last selected node to prevent crashes during exit animations
  if (selectedNode && selectedNode !== lastSelectedNode) {
    setLastSelectedNode(selectedNode);
  }

  const displayNode = selectedNode || lastSelectedNode;

  const getAlertBorderClass = (status: string) => {
    switch (status) {
      case "emergency":
      case "critical":
        return "border-alert-critical/20 hover:border-alert-critical/40 bg-alert-critical/5";
      case "warning":
        return "border-alert-warning/20 hover:border-alert-warning/40 bg-alert-warning/5";
      case "watch":
        return "border-alert-watch/20 hover:border-alert-watch/40 bg-alert-watch/5";
      default:
        return "border-alert-normal/20 hover:border-alert-normal/40 bg-alert-normal/5";
    }
  };

  const getAlertTextClass = (status: string) => {
    switch (status) {
      case "emergency":
      case "critical":
        return "text-alert-critical bg-alert-critical/10 border-alert-critical/20";
      case "warning":
        return "text-alert-warning bg-alert-warning/10 border-alert-warning/20";
      case "watch":
        return "text-alert-watch bg-alert-watch/10 border-alert-watch/20";
      default:
        return "text-alert-normal bg-alert-normal/10 border-alert-normal/20";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="hidden md:flex flex-col w-[420px] max-h-[calc(100vh-48px)] m-6 bg-bg-surface-glass border border-white/10 rounded-xl shadow-2xl backdrop-blur-md z-10 overflow-hidden"
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-accent">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white uppercase">SAFE-NIGERIA</h1>
            <p className="text-[10px] text-white/50 tracking-wider font-mono">PUBLIC PORTAL</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-alert-normal"></span>
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-semibold tracking-wider uppercase select-none">Live Sync</span>
        </div>
      </div>

      {/* Main Panel Area */}
      <div className="p-5 flex-1 overflow-y-auto scrollbar-none flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {!selectedNode ? (
            /* Dashboard Home View */
            <motion.div
              key="dashboard-home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 flex flex-col flex-1"
            >
              {/* Component 1: National Risk Summary */}
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-[11px] font-mono text-white/50 tracking-wider uppercase">National Risk Summary</h2>
                  <Activity className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-alert-critical/5 border border-alert-critical/10 rounded p-2.5 text-center">
                    <div className="font-mono text-xl font-bold text-alert-critical leading-none">{activeWarnings.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] text-white/40 font-mono mt-1 uppercase">Warnings</div>
                  </div>
                  <div className="bg-alert-warning/5 border border-alert-warning/10 rounded p-2.5 text-center">
                    <div className="font-mono text-xl font-bold text-alert-warning leading-none">{watchAreas.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] text-white/40 font-mono mt-1 uppercase">Watch</div>
                  </div>
                  <div className="bg-brand-accent/5 border border-brand-accent/10 rounded p-2.5 text-center">
                    <div className="font-mono text-xl font-bold text-brand-accent leading-none">{activeNodes.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] text-white/40 font-mono mt-1 uppercase">Stations</div>
                  </div>
                </div>
              </motion.div>

              {/* Component 3: Public Alerts Feed */}
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex-1 flex flex-col justify-start">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-[11px] font-mono text-white/50 tracking-wider uppercase">Active Basin Feeds</h2>
                  <AlertTriangle className="w-3.5 h-3.5 text-alert-warning" />
                </div>
                <div className="space-y-2 overflow-y-auto scrollbar-none flex-1 max-h-[220px]">
                  {(nodes || []).map((node) => (
                    <div
                      key={node.id}
                      onClick={() => onSelectNode(node.id)}
                      className={`p-3 border rounded transition-all duration-200 cursor-pointer flex justify-between items-center ${getAlertBorderClass(node.status)}`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-white/90">{node.name}</div>
                        <div className="text-[10px] text-white/40 font-mono mt-0.5">{node.state}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[8px] font-mono font-semibold px-2 py-0.5 rounded border uppercase ${getAlertTextClass(node.status)}`}>
                          {node.status}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Sighting reporting widget placeholder */}
              <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-[11px] font-mono text-white/50 tracking-wider uppercase">Field Sighting Report</h2>
                  <CloudRain className="w-3.5 h-3.5 text-white/30" />
                </div>
                <div className="border border-dashed border-white/10 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/[0.01] transition-all">
                  <Upload className="w-6 h-6 text-white/40 mb-2" />
                  <div className="text-xs font-semibold text-white/80">Submit Sighting Report</div>
                  <div className="text-[9px] text-white/40 mt-1 max-w-[200px]">
                    Upload flood photos/videos for Gemini Vision severity verification.
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Component 2: Live Node Telemetry (Clicked Node View) */
            displayNode && (
              <motion.div
                key="node-telemetry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex flex-col flex-1"
              >
                {/* Back Button */}
                <button
                  onClick={() => onSelectNode(null)}
                  className="flex items-center space-x-2 text-xs font-mono text-white/60 hover:text-white transition-colors cursor-pointer w-fit select-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK TO OVERVIEW</span>
                </button>

                {/* Node Summary Card */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-mono text-brand-accent tracking-widest uppercase">STATION {displayNode.id}</span>
                      <h2 className="text-sm font-bold text-white mt-0.5">{displayNode.name}</h2>
                      <p className="text-[10px] text-white/50 font-mono mt-0.5">{displayNode.locationName}</p>
                    </div>
                    <span className={`text-[8px] font-mono font-semibold px-2 py-0.5 rounded border uppercase ${getAlertTextClass(displayNode.status)}`}>
                      {displayNode.status}
                    </span>
                  </div>

                  {/* Grid stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/[0.01] border border-white/5 rounded p-2.5">
                      <span className="text-[8px] font-mono text-white/40 uppercase">Water Level</span>
                      <div className="flex items-baseline space-x-1 mt-1">
                        <span className="font-mono text-lg font-bold text-white">{displayNode.waterLevel.toFixed(2)}</span>
                        <span className="text-[10px] text-white/50">m</span>
                      </div>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded p-2.5">
                      <span className="text-[8px] font-mono text-white/40 uppercase">Rise Rate</span>
                      <div className="flex items-baseline space-x-1 mt-1">
                        <span className={`font-mono text-lg font-bold ${displayNode.waterRiseRate > 0 ? "text-alert-warning" : "text-alert-normal"}`}>
                          {displayNode.waterRiseRate > 0 ? `+${displayNode.waterRiseRate.toFixed(2)}` : displayNode.waterRiseRate.toFixed(2)}
                        </span>
                        <span className="text-[8px] text-white/50">m/h</span>
                        {displayNode.waterRiseRate > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5 text-alert-warning ml-1.5 self-center" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-alert-normal ml-1.5 self-center" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SVG Area Chart render */}
                  <NodeChart node={displayNode} />
                </div>

                {/* Hardware Device Health Card */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                  <h3 className="text-[9px] font-mono text-white/50 tracking-wider uppercase mb-3">HARDWARE DIAGNOSTICS</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2.5">
                      <Battery className={`w-4 h-4 ${displayNode.batteryHealth > 30 ? "text-brand-accent" : "text-alert-warning"}`} />
                      <div>
                        <div className="text-[8px] text-white/40 font-mono uppercase leading-none">Battery</div>
                        <div className="text-[11px] font-mono font-bold text-white mt-1">{displayNode.batteryHealth}%</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Radio className="w-4 h-4 text-brand-accent" />
                      <div>
                        <div className="text-[8px] text-white/40 font-mono uppercase leading-none">Signal</div>
                        <div className="text-[11px] font-mono font-bold text-white mt-1">{displayNode.signalStrength} dBm</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/30 select-none">
        <div className="flex items-center space-x-1">
          <MapPin className="w-3 h-3 text-brand-accent" />
          <span>{selectedNode ? selectedNode.state : "Nigeria Overview"}</span>
        </div>
        <span>v2.1.0-alpha</span>
      </div>
    </motion.div>
  );
}
