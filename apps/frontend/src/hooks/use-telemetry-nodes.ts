"use client";

import { useState } from "react";

export interface TelemetryNode {
  id: string;
  name: string;
  locationName: string;
  state: string;
  lga: string;
  latitude: number;
  longitude: number;
  waterLevel: number; // in meters
  criticalThreshold: number; // in meters
  warningThreshold: number; // in meters
  watchThreshold: number; // in meters
  batteryHealth: number; // percentage
  signalStrength: number; // dBm
  lastReported: string;
  status: "normal" | "watch" | "warning" | "critical" | "emergency";
  waterRiseRate: number; // meters per hour
}

const MOCK_NODES: TelemetryNode[] = [
  {
    id: "SN-014",
    name: "Lokoja Confluence",
    locationName: "Ganaja River confluence, Lokoja",
    state: "Kogi",
    lga: "Lokoja",
    latitude: 7.8023,
    longitude: 6.7431,
    waterLevel: 7.8,
    criticalThreshold: 7.5,
    warningThreshold: 6.5,
    watchThreshold: 5.5,
    batteryHealth: 92,
    signalStrength: 88, // 88%
    lastReported: new Date(Date.now() - 4 * 60000).toISOString(),
    status: "critical",
    waterRiseRate: 0.42,
  },
  {
    id: "SN-027",
    name: "Yenagoa Delta",
    locationName: "Nun River Bank, Yenagoa",
    state: "Bayelsa",
    lga: "Yenagoa",
    latitude: 4.9267,
    longitude: 6.2676,
    waterLevel: 6.4,
    criticalThreshold: 6.8,
    warningThreshold: 5.8,
    watchThreshold: 4.8,
    batteryHealth: 81,
    signalStrength: 74, // 74%
    lastReported: new Date(Date.now() - 120 * 60000).toISOString(),
    status: "warning",
    waterRiseRate: 0.28,
  },
  {
    id: "SN-003",
    name: "Niamey-Niger",
    locationName: "Sokoto-Rima Basin, Birnin Kebbi",
    state: "Kebbi",
    lga: "Birnin Kebbi",
    latitude: 12.45,
    longitude: 4.2,
    waterLevel: 5.1,
    criticalThreshold: 6.0,
    warningThreshold: 5.0,
    watchThreshold: 4.0,
    batteryHealth: 76,
    signalStrength: 65, // 65%
    lastReported: new Date(Date.now() - 60 * 60000).toISOString(),
    status: "watch",
    waterRiseRate: 0.12,
  },
  {
    id: "SN-041",
    name: "Makurdi Benue",
    locationName: "Wurukum Riverbank, Makurdi",
    state: "Benue",
    lga: "Makurdi",
    latitude: 7.7337,
    longitude: 8.5214,
    waterLevel: 6.9,
    criticalThreshold: 7.2,
    warningThreshold: 6.2,
    watchThreshold: 5.2,
    batteryHealth: 88,
    signalStrength: 90, // 90%
    lastReported: new Date(Date.now() - 22 * 60000).toISOString(),
    status: "warning",
    waterRiseRate: 0.35,
  },
  {
    id: "SN-009",
    name: "Lagos Lagoon",
    locationName: "Eti-Osa Coastal Zone, Lagos",
    state: "Lagos",
    lga: "Eti-Osa",
    latitude: 6.4279,
    longitude: 3.4251,
    waterLevel: 3.2,
    criticalThreshold: 5.0,
    warningThreshold: 4.0,
    watchThreshold: 3.0,
    batteryHealth: 95,
    signalStrength: 96, // 96%
    lastReported: new Date(Date.now() - 300 * 60000).toISOString(),
    status: "normal",
    waterRiseRate: -0.05,
  },
  {
    id: "SN-052",
    name: "Maiduguri Komadugu",
    locationName: "Alau Dam Reservoir, Maiduguri",
    state: "Borno",
    lga: "Maiduguri",
    latitude: 11.8333,
    longitude: 13.15,
    waterLevel: 4.4,
    criticalThreshold: 5.5,
    warningThreshold: 4.5,
    watchThreshold: 3.8,
    batteryHealth: 70,
    signalStrength: 58, // 58%
    lastReported: new Date(Date.now() - 180 * 60000).toISOString(),
    status: "watch",
    waterRiseRate: 0.18,
  },
  {
    id: "SN-018",
    name: "Port Harcourt Bonny",
    locationName: "Bonny River Anchorage, PH",
    state: "Rivers",
    lga: "Obio-Akpor",
    latitude: 4.78,
    longitude: 7.01,
    waterLevel: 5.8,
    criticalThreshold: 7.0,
    warningThreshold: 6.0,
    watchThreshold: 5.0,
    batteryHealth: 84,
    signalStrength: 79, // 79%
    lastReported: new Date(Date.now() - 120 * 60000).toISOString(),
    status: "watch",
    waterRiseRate: 0.22,
  },
  {
    id: "SN-036",
    name: "Sokoto Rima",
    locationName: "Rima Bridgebank, Sokoto",
    state: "Sokoto",
    lga: "Sokoto",
    latitude: 13.06,
    longitude: 5.23,
    waterLevel: 2.9,
    criticalThreshold: 5.0,
    warningThreshold: 4.0,
    watchThreshold: 3.0,
    batteryHealth: 91,
    signalStrength: 82, // 82%
    lastReported: new Date(Date.now() - 240 * 60000).toISOString(),
    status: "normal",
    waterRiseRate: 0.04,
  },
  {
    id: "SN-061",
    name: "Onitsha Bridgehead",
    locationName: "River Niger Bridgehead, Onitsha",
    state: "Anambra",
    lga: "Onitsha",
    latitude: 6.13,
    longitude: 6.78,
    waterLevel: 7.2,
    criticalThreshold: 7.0,
    warningThreshold: 6.0,
    watchThreshold: 5.0,
    batteryHealth: 86,
    signalStrength: 71, // 71%
    lastReported: new Date(Date.now() - 60 * 60000).toISOString(),
    status: "critical",
    waterRiseRate: 0.38,
  },
  {
    id: "SN-022",
    name: "Abuja Jabi Reservoir",
    locationName: "Jabi Lake Spillway, Abuja",
    state: "FCT",
    lga: "Abuja",
    latitude: 9.07,
    longitude: 7.48,
    waterLevel: 3.6,
    criticalThreshold: 5.5,
    warningThreshold: 4.5,
    watchThreshold: 3.5,
    batteryHealth: 94,
    signalStrength: 92, // 92%
    lastReported: new Date(Date.now() - 40 * 60000).toISOString(),
    status: "normal",
    waterRiseRate: 0.02,
  },
];

export function useTelemetryNodes() {
  const [nodes, setNodes] = useState<TelemetryNode[]>(MOCK_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;

  const selectNode = (id: string | null) => {
    setSelectedNodeId(id);
  };

  return {
    nodes,
    selectedNode,
    selectedNodeId,
    selectNode,
  };
}
