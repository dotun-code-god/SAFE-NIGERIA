"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { MapProvider, useMap } from "react-map-gl/mapbox";
import { useTelemetryNodes, TelemetryNode } from "@/hooks/use-telemetry-nodes";
import DesktopSidebar from "@/components/portal/desktop-sidebar";
import MobileDrawer from "@/components/portal/mobile-drawer";

// Dynamically import map component with SSR disabled to prevent node/window WebGL reference errors
const FloodMap = dynamic(() => import("@/components/portal/flood-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-bg-base flex items-center justify-center font-mono text-xs text-white/40">
      Initializing WebGL Canvas...
    </div>
  ),
});

// Helper component that consumes MapProvider context to trigger smooth camera flyTo transitions
function MapController({ 
  selectedNodeId, 
  nodes 
}: { 
  selectedNodeId: string | null; 
  nodes: TelemetryNode[]; 
}) {
  const { portalMap } = useMap();

  useEffect(() => {
    if (selectedNodeId && portalMap) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        portalMap.flyTo({
          center: [node.longitude, node.latitude],
          zoom: 8.5,
          duration: 2000,
          essential: true,
        });
      }
    }
  }, [selectedNodeId, nodes, portalMap]);

  return null;
}

export default function PortalPage() {
  const { nodes, selectedNodeId, selectNode } = useTelemetryNodes();

  return (
    <MapProvider>
      <main className="relative w-screen h-screen flex flex-col justify-between md:justify-start md:flex-row overflow-hidden bg-bg-base select-none">
        {/* Map Controller Context Consumer */}
        <MapController selectedNodeId={selectedNodeId} nodes={nodes} />

        {/* Layer 0: Map Background Canvas */}
        <FloodMap 
          nodes={nodes} 
          selectedNodeId={selectedNodeId} 
          onSelectNode={selectNode} 
        />

        {/* Layer 1: Operational Overlays */}
        <DesktopSidebar 
          nodes={nodes} 
          selectedNodeId={selectedNodeId} 
          onSelectNode={selectNode} 
        />
        <MobileDrawer 
          nodes={nodes} 
          selectedNodeId={selectedNodeId} 
          onSelectNode={selectNode} 
        />
      </main>
    </MapProvider>
  );
}
