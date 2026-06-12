import type { Metadata } from "next";
import QueryProvider from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAFE-NIGERIA | Public Monitoring Portal",
  description: "Real-time flood intelligence and community reporting system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --font-inter: 'Inter', sans-serif;
            --font-jetbrains-mono: 'JetBrains Mono', monospace;
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0F19] text-[#ededed]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
