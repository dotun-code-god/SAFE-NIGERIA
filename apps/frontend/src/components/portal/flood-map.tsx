"use client";

import React, { useState } from "react";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl/mapbox";
import { motion, AnimatePresence } from "framer-motion";
import { TelemetryNode } from "@/hooks/use-telemetry-nodes";
import { MapPin, AlertTriangle, ShieldAlert, CheckCircle, Info } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

interface FloodMapProps {
  nodes: TelemetryNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
}

// Mock GeoJSON representation of River Basins Risk Zones in Nigeria
const RISK_ZONES_GEOJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "zone-lokoja",
        name: "Lokoja Niger-Benue Basin",
        riskLevel: "emergency",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [6.5, 7.6],
          [7.0, 7.6],
          [7.1, 7.9],
          [6.6, 8.0],
          [6.3, 7.8],
          [6.5, 7.6]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zone-makurdi",
        name: "Makurdi Benue Basin",
        riskLevel: "warning",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [8.2, 7.5],
          [8.8, 7.5],
          [8.9, 7.9],
          [8.3, 7.9],
          [8.2, 7.5]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zone-yenagoa",
        name: "Yenagoa Nun Basin",
        riskLevel: "watch",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [6.0, 4.7],
          [6.5, 4.7],
          [6.5, 5.1],
          [5.9, 5.2],
          [6.0, 4.7]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zone-kainji",
        name: "Kainji Dam Basin",
        riskLevel: "normal",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [4.3, 9.6],
          [4.8, 9.6],
          [4.9, 10.0],
          [4.4, 10.0],
          [4.3, 9.6]
        ]]
      }
    }
  ]
};

export default function FloodMap({ nodes, selectedNodeId, onSelectNode }: FloodMapProps) {
  const [viewState, setViewState] = useState({
    longitude: 6.8, // Centered on Nigeria river networks
    latitude: 7.5,
    zoom: 6.0,
  });

  const [hoveredNode, setHoveredNode] = useState<TelemetryNode | null>(null);

  // Retrieve Mapbox token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const getAlertColor = (status: string) => {
    switch (status) {
      case "emergency":
        return "#991B1B";
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

  const getAlertTailwindClass = (status: string) => {
    switch (status) {
      case "emergency":
        return "bg-alert-emergency";
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

  // GeoJSON style styling rules
  const fillLayerStyle: any = {
    id: "risk-zones-fill",
    type: "fill",
    paint: {
      "fill-color": [
        "match",
        ["get", "riskLevel"],
        "emergency", "#991B1B",
        "critical", "#EF4444",
        "warning", "#F97316",
        "watch", "#F59E0B",
        "#10B981"
      ],
      "fill-opacity": 0.3,
    }
  };

  const lineLayerStyle: any = {
    id: "risk-zones-outline",
    type: "line",
    paint: {
      "line-color": [
        "match",
        ["get", "riskLevel"],
        "emergency", "#991B1B",
        "critical", "#EF4444",
        "warning", "#F97316",
        "watch", "#F59E0B",
        "#10B981"
      ],
      "line-width": 2,
    }
  };

  // Fallback map container if token is missing
  if (!mapboxToken) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-bg-base z-0">
        {/* Visual grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38BDF8 1px, transparent 1px),
              linear-gradient(to bottom, #38BDF8 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
          }}
        />

        {/* Warning Banner */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-bg-surface border border-alert-watch/20 text-alert-watch rounded-lg px-4 py-2.5 shadow-2xl flex items-center space-x-2.5 z-20 backdrop-blur-md text-xs font-mono max-w-[90%] md:max-w-md">
          <AlertTriangle className="w-5 h-5 text-alert-watch flex-shrink-0 animate-pulse" />
          <div>
            <span className="font-bold">Mapbox Access Token Missing</span>
            <p className="text-[10px] text-white/50 mt-0.5">Running in sandbox mode. Set <code className="text-white">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> in your environment variables to enable fully-functional dark satellite maps.</p>
          </div>
        </div>

        {/* Mock Interactive Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => onSelectNode(node.id === selectedNodeId ? null : node.id)}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${((node.longitude - 3.5) / 10.5) * 80 + 10}%`,
              top: `${(1 - (node.latitude - 4.0) / 9.5) * 80 + 10}%`,
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Pulse rings for active nodes */}
              {(node.status === "emergency" || node.status === "critical" || node.status === "warning") && (
                <motion.div
                  className={`absolute w-8 h-8 rounded-full ${getAlertTailwindClass(node.status)} opacity-30`}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0.0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                />
              )}
              {/* Inner dot */}
              <div 
                className={`w-4.5 h-4.5 rounded-full ${getAlertTailwindClass(node.status)} border border-white/20 shadow-lg flex items-center justify-center transition-transform group-hover:scale-125 duration-200 ${
                  selectedNodeId === node.id ? "ring-2 ring-brand-accent scale-110" : ""
                }`}
              >
                {node.status === "emergency" || node.status === "critical" ? (
                  <ShieldAlert className="w-2.5 h-2.5 text-white animate-pulse" />
                ) : node.status === "warning" ? (
                  <AlertTriangle className="w-2.5 h-2.5 text-white" />
                ) : (
                  <CheckCircle className="w-2.5 h-2.5 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Tooltip Overlay */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none bg-bg-surface/95 border border-white/10 shadow-2xl p-3.5 rounded-lg text-white font-mono text-xs z-30 max-w-[240px]"
              style={{
                left: `${((hoveredNode.longitude - 3.5) / 10.5) * 80 + 10}%`,
                top: `${(1 - (hoveredNode.latitude - 4.0) / 9.5) * 80 + 10 - 8}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="font-bold text-white mb-1">{hoveredNode.name}</div>
              <div className="text-[10px] text-white/50 mb-2">{hoveredNode.locationName}</div>
              <div className="space-y-1 border-t border-white/5 pt-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span>Water Level:</span>
                  <span className="font-bold text-brand-accent">{hoveredNode.waterLevel.toFixed(2)}m</span>
                </div>
                <div className="flex justify-between">
                  <span>Rise Rate:</span>
                  <span className={hoveredNode.waterRiseRate > 0 ? "text-alert-warning" : "text-alert-normal"}>
                    {hoveredNode.waterRiseRate > 0 ? `+${hoveredNode.waterRiseRate}m/h` : `${hoveredNode.waterRiseRate}m/h`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Alert Tier:</span>
                  <span className="font-bold capitalize" style={{ color: getAlertColor(hoveredNode.status) }}>
                    {hoveredNode.status}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render fully integrated Mapbox GL Map
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Map
        id="portalMap"
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" />

        {/* Polygons Risk Zones Layer */}
        <Source id="risk-zones" type="geojson" data={RISK_ZONES_GEOJSON}>
          <Layer {...fillLayerStyle} />
          <Layer {...lineLayerStyle} />
        </Source>

        {/* Interactive Custom Markers */}
        {nodes.map((node) => (
          <Marker
            key={node.id}
            latitude={node.latitude}
            longitude={node.longitude}
            anchor="center"
          >
            <div
              onClick={() => onSelectNode(node.id === selectedNodeId ? null : node.id)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              className="relative flex items-center justify-center cursor-pointer group"
            >
              {/* Pulsing visual halo for warnings/emergencies */}
              {(node.status === "emergency" || node.status === "critical" || node.status === "warning") && (
                <motion.div
                  className={`absolute w-8 h-8 rounded-full opacity-35`}
                  style={{ backgroundColor: getAlertColor(node.status) }}
                  animate={{ scale: [1, 2.5, 1], opacity: [0.35, 0.0, 0.35] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                />
              )}
              {/* Node core element */}
              <div 
                className={`w-5 h-5 rounded-full border border-white/25 shadow-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-125 ${
                  selectedNodeId === node.id ? "ring-2 ring-brand-accent scale-115" : ""
                }`}
                style={{ backgroundColor: getAlertColor(node.status) }}
              >
                {node.status === "emergency" || node.status === "critical" ? (
                  <ShieldAlert className="w-3 h-3 text-white animate-pulse" />
                ) : node.status === "warning" ? (
                  <AlertTriangle className="w-3 h-3 text-white" />
                ) : (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </Marker>
        ))}

        {/* Info tooltips for hovered marker nodes */}
        {hoveredNode && (
          <div className="absolute z-30 pointer-events-none bg-bg-surface/95 border border-white/10 shadow-2xl p-3.5 rounded-lg text-white font-mono text-xs select-none max-w-[240px] shadow-black/80"
               style={{
                 left: "50%",
                 top: "24px",
                 transform: "translateX(-50%)",
               }}>
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              <Info className="w-3.5 h-3.5 text-brand-accent" />
              <span>{hoveredNode.name}</span>
            </div>
            <div className="text-[10px] text-white/50 mb-2">{hoveredNode.locationName}</div>
            <div className="space-y-1 pt-1.5 border-t border-white/5 text-[10px]">
              <div className="flex justify-between">
                <span>Water level:</span>
                <span className="font-bold text-brand-accent">{hoveredNode.waterLevel.toFixed(2)}m</span>
              </div>
              <div className="flex justify-between">
                <span>Alert Status:</span>
                <span className="font-bold capitalize" style={{ color: getAlertColor(hoveredNode.status) }}>
                  {hoveredNode.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}
