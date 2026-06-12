"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { TelemetryNode } from "@/hooks/use-telemetry-nodes";
import { 
  Activity, Shield, AlertTriangle, CloudRain, Upload, MapPin, 
  ChevronUp, ChevronDown, Battery, Radio, TrendingUp, TrendingDown, ArrowLeft 
} from "lucide-react";

interface MobileDrawerProps {
  nodes: TelemetryNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
}

// Reuse NodeChart inside mobile drawer
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
    const width = 320;
    const height = 70;
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
        <span>Real-time</span>
      </div>
      <div className="relative bg-white/[0.01] border border-white/5 rounded p-1 overflow-hidden h-[80px]">
        <svg viewBox="0 0 320 70" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`mgrad-${node.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Critical Threshold line */}
          {node.criticalThreshold < maxLevel && (
            <line
              x1="0"
              y1={70 - 10 - ((node.criticalThreshold - minLevel) / (maxLevel - minLevel)) * 50}
              x2="320"
              y2={70 - 10 - ((node.criticalThreshold - minLevel) / (maxLevel - minLevel)) * 50}
              stroke="#EF4444"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          )}

          <path d={fillPath} fill={`url(#mgrad-${node.id})`} />
          <path d={linePath} fill="none" stroke={chartColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

          {data.map((val, index) => {
            const width = 320;
            const padding = 10;
            const usableWidth = width - padding * 2;
            const x = padding + (index / (data.length - 1)) * usableWidth;
            const y = 70 - padding - ((val - minLevel) / (maxLevel - minLevel)) * 50;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={index === data.length - 1 ? 2.5 : 1}
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

export default function MobileDrawer({ nodes = [], selectedNodeId, onSelectNode }: MobileDrawerProps) {
  const [lastSelectedNode, setLastSelectedNode] = useState<TelemetryNode | null>(null);
  const [isOpen, setIsOpen] = useState<"collapsed" | "half" | "expanded">("collapsed");
  const controls = useAnimation();

  // Snaps to height modes on drag end
  const handleDragEnd = (event: any, info: any) => {
    const velocityY = info.velocity.y;
    const offsetPercent = info.offset.y / window.innerHeight;

    if (isOpen === "collapsed") {
      if (velocityY < -100 || offsetPercent < -0.05) {
        setIsOpen("half");
      }
    } else if (isOpen === "half") {
      if (velocityY < -150 || offsetPercent < -0.15) {
        setIsOpen("expanded");
      } else if (velocityY > 150 || offsetPercent > 0.15) {
        setIsOpen("collapsed");
      }
    } else if (isOpen === "expanded") {
      if (velocityY > 100 || offsetPercent > 0.1) {
        setIsOpen("half");
      }
    }
  };

  useEffect(() => {
    controls.start(isOpen);
  }, [isOpen, controls]);

  // If a node gets selected externally (e.g. from page trigger), open the drawer to "half" view automatically
  useEffect(() => {
    if (selectedNodeId) {
      setIsOpen("half");
    }
  }, [selectedNodeId]);

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
        return "border-alert-critical/20 bg-alert-critical/5";
      case "warning":
        return "border-alert-warning/20 bg-alert-warning/5";
      case "watch":
        return "border-alert-watch/20 bg-alert-watch/5";
      default:
        return "border-alert-normal/20 bg-alert-normal/5";
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

  const drawerVariants = {
    collapsed: { height: "70px", y: 0 },
    half: { height: "45vh", y: 0 },
    expanded: { height: "85vh", y: 0 },
  };

  return (
    <motion.div
      drag="y"
      dragDirectionLock
      dragElastic={{ top: 0.05, bottom: 0.1 }}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      variants={drawerVariants}
      initial="collapsed"
      animate={controls}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-bg-surface/95 border-t border-white/10 rounded-t-2xl shadow-2xl backdrop-blur-md z-10 flex flex-col select-none touch-pan-y"
    >
      {/* Drag handle & Header */}
      <div 
        onClick={() => setIsOpen(isOpen === "collapsed" ? "half" : isOpen === "half" ? "expanded" : "collapsed")}
        className="flex flex-col items-center py-2 cursor-pointer border-b border-white/5 bg-white/[0.01]"
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mb-1.5" />
        
        <div className="w-full px-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Shield className="w-4.5 h-4.5 text-brand-accent animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wider uppercase">SAFE-NIGERIA</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-alert-normal animate-pulse" />
            <span className="text-[9px] font-mono text-white/50 tracking-wider">LIVE</span>
            {isOpen === "collapsed" ? (
              <ChevronUp className="w-4 h-4 text-white/40 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 ml-1" />
            )}
          </div>
        </div>
      </div>

      {/* Drawer content */}
      <div className="flex-1 overflow-y-auto scrollbar-none p-5 space-y-4">
        <AnimatePresence mode="wait">
          {!selectedNode ? (
            /* General Dashboard Mode */
            <motion.div
              key="mobile-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* National Risk Summary */}
              <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">Risk Summary</span>
                  <Activity className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-alert-critical/5 border border-alert-critical/10 rounded p-2 text-center">
                    <div className="font-mono text-base font-bold text-alert-critical">{activeWarnings.toString().padStart(2, '0')}</div>
                    <div className="text-[7px] text-white/40 font-mono mt-0.5 uppercase">Critical</div>
                  </div>
                  <div className="bg-alert-warning/5 border border-alert-warning/10 rounded p-2 text-center">
                    <div className="font-mono text-base font-bold text-alert-warning">{watchAreas.toString().padStart(2, '0')}</div>
                    <div className="text-[7px] text-white/40 font-mono mt-0.5 uppercase">Watch</div>
                  </div>
                  <div className="bg-brand-accent/5 border border-brand-accent/10 rounded p-2 text-center">
                    <div className="font-mono text-base font-bold text-brand-accent">{activeNodes.toString().padStart(2, '0')}</div>
                    <div className="text-[7px] text-white/40 font-mono mt-0.5 uppercase">Nodes</div>
                  </div>
                </div>
              </div>

              {/* Active alerts lists */}
              <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">Active Alerts</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-alert-warning" />
                </div>
                <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-none">
                  {(nodes || []).map((node) => (
                    <div
                      key={node.id}
                      onClick={() => onSelectNode(node.id)}
                      className={`p-2.5 border rounded flex justify-between items-center ${getAlertBorderClass(node.status)}`}
                    >
                      <div className="text-[10px] font-semibold text-white/95">{node.name}</div>
                      <span className={`text-[7px] font-mono font-semibold px-1.5 py-0.5 rounded border uppercase ${getAlertTextClass(node.status)}`}>
                        {node.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sighting uploader placeholder */}
              <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">Field Sighting</span>
                  <CloudRain className="w-3.5 h-3.5 text-white/30" />
                </div>
                <div className="border border-dashed border-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/[0.01]">
                  <Upload className="w-5 h-5 text-white/40 mb-1" />
                  <div className="text-[10px] font-semibold text-white/80">Submit Sighting Report</div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Selected Node Telemetry Mode */
            displayNode && (
              <motion.div
                key="mobile-node"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Back overview button */}
                <button
                  onClick={() => onSelectNode(null)}
                  className="flex items-center space-x-2 text-[10px] font-mono text-white/60 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>OVERVIEW</span>
                </button>

                {/* Node Summary details */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-mono text-brand-accent uppercase">STATION {displayNode.id}</span>
                      <h3 className="text-xs font-bold text-white mt-0.5">{displayNode.name}</h3>
                    </div>
                    <span className={`text-[7px] font-mono font-semibold px-1.5 py-0.5 rounded border uppercase ${getAlertTextClass(displayNode.status)}`}>
                      {displayNode.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-white/[0.01] border border-white/5 rounded p-2">
                      <span className="text-[7px] font-mono text-white/40 uppercase">Level</span>
                      <div className="flex items-baseline space-x-0.5 mt-0.5">
                        <span className="font-mono text-sm font-bold text-white">{displayNode.waterLevel.toFixed(2)}</span>
                        <span className="text-[8px] text-white/50">m</span>
                      </div>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded p-2">
                      <span className="text-[7px] font-mono text-white/40 uppercase">Rise Rate</span>
                      <div className="flex items-baseline space-x-0.5 mt-0.5">
                        <span className={`font-mono text-sm font-bold ${displayNode.waterRiseRate > 0 ? "text-alert-warning" : "text-alert-normal"}`}>
                          {displayNode.waterRiseRate > 0 ? `+${displayNode.waterRiseRate.toFixed(2)}` : displayNode.waterRiseRate.toFixed(2)}
                        </span>
                        <span className="text-[7px] text-white/50">m/h</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Area Chart */}
                  <NodeChart node={displayNode} />
                </div>

                {/* Device health */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Battery className="w-3.5 h-3.5 text-brand-accent" />
                      <div>
                        <div className="text-[7px] text-white/40 font-mono uppercase">Battery</div>
                        <div className="text-[10px] font-mono font-bold text-white">{displayNode.batteryHealth}%</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Radio className="w-3.5 h-3.5 text-brand-accent" />
                      <div>
                        <div className="text-[7px] text-white/40 font-mono uppercase">Signal</div>
                        <div className="text-[10px] font-mono font-bold text-white">{displayNode.signalStrength} dBm</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
