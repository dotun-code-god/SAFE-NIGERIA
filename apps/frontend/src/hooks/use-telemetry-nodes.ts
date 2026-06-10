"use client";

import { useState } from "react";

export interface TelemetryNode {
  id: string;
  name: string;
  locationName: string;
  state: string;
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
    id: "LK-01",
    name: "Lokoja Confluence Node",
    locationName: "Ganaja Riverbank, Lokoja",
    state: "Kogi State",
    latitude: 7.8023,
    longitude: 6.7431,
    waterLevel: 9.85,
    criticalThreshold: 9.0,
    warningThreshold: 8.0,
    watchThreshold: 7.0,
    batteryHealth: 94,
    signalStrength: -68,
    lastReported: new Date(Date.now() - 4 * 60000).toISOString(), // 4 mins ago
    status: "emergency",
    waterRiseRate: 0.12,
  },
  {
    id: "MK-02",
    name: "Benue River Bridge Node",
    locationName: "Wurukum Riverbank, Makurdi",
    state: "Benue State",
    latitude: 7.7337,
    longitude: 8.5214,
    waterLevel: 8.42,
    criticalThreshold: 8.5,
    warningThreshold: 7.5,
    watchThreshold: 6.5,
    batteryHealth: 88,
    signalStrength: -74,
    lastReported: new Date(Date.now() - 12 * 60000).toISOString(),
    status: "warning",
    waterRiseRate: 0.05,
  },
  {
    id: "YG-04",
    name: "Nun River Basin Node",
    locationName: "Tombia Bridge, Yenagoa",
    state: "Bayelsa State",
    latitude: 4.9267,
    longitude: 6.2676,
    waterLevel: 5.12,
    criticalThreshold: 6.0,
    warningThreshold: 5.0,
    watchThreshold: 4.0,
    batteryHealth: 92,
    signalStrength: -81,
    lastReported: new Date(Date.now() - 25 * 60000).toISOString(),
    status: "watch",
    waterRiseRate: 0.02,
  },
  {
    id: "KJ-03",
    name: "Kainji Reservoir Node",
    locationName: "Dam Spillway Section, Kainji",
    state: "Niger State",
    latitude: 9.8333,
    longitude: 4.6,
    waterLevel: 4.25,
    criticalThreshold: 7.0,
    warningThreshold: 5.5,
    watchThreshold: 4.5,
    batteryHealth: 99,
    signalStrength: -62,
    lastReported: new Date(Date.now() - 1 * 60000).toISOString(),
    status: "normal",
    waterRiseRate: -0.01,
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
