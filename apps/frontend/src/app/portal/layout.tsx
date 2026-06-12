import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Monitoring Portal — SAFE-NIGERIA",
  description: "Real-time flood intelligence, sensor network status, alerts, and community reporting across Nigeria.",
  openGraph: {
    title: "SAFE-NIGERIA Public Monitoring Portal",
    description: "Live water levels, rainfall, and flood risk forecasts from solar-powered sentinel nodes nationwide.",
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
