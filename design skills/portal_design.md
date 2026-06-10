# SAFE-NIGERIA: Public Monitoring Portal
## UI/UX Design Specification for Antigravity 2.0

**Target Application:** Next.js (TypeScript), Tailwind CSS, Framer Motion, React-Map-GL.
**Design Ethos:** Authoritative, High-Trust, Geospatial-First, Mission Control meets Public Accessibility.

---

## 1. Global Theming & Design Tokens

### Color Palette (Tailwind Configuration)
Implement a precise semantic color system to communicate varying levels of flood risk clearly, grounded in a clean, high-contrast dark/light mode schema.

* **Backgrounds (Dark Mode Preferred for Map Contrast):**
    * `bg-base`: `#0B0F19` (Deep telemetry blue/black)
    * `bg-surface`: `#111827` (Panel backgrounds)
    * `bg-surface-glass`: `rgba(17, 24, 39, 0.75)` with `backdrop-blur-md`
* **Brand & Accents:**
    * `brand-primary`: `#2563EB` (Trustworthy blue)
    * `brand-accent`: `#38BDF8` (Bright cyan for active map nodes)
* **Semantic Alert Tiers (Critical for Map Polygons & Badges):**
    * `alert-normal` (Green): `#10B981` / `bg-emerald-500/10` `text-emerald-400`
    * `alert-watch` (Yellow): `#F59E0B` / `bg-amber-500/10` `text-amber-400`
    * `alert-warning` (Orange): `#F97316` / `bg-orange-500/10` `text-orange-400`
    * `alert-critical` (Red): `#EF4444` / `bg-red-500/10` `text-red-400`
    * `alert-emergency` (Crimson): `#991B1B` (Pulsing animations required)

### Typography
* **Headings/Display:** `Inter` or `Geist Sans` (Clean, geometric, tight tracking).
* **Data/Monospace (Telemetry & Coordinates):** `JetBrains Mono` or `Geist Mono` for all numbers, timestamps, and sensor readouts to ensure vertical alignment.

---

## 2. Layout Architecture (The Shell)

The application utilizes a **Spatial Interface Layout**. The map is not a container; it is the absolute background.

### Viewport Structure
* **Layer 0 (Base):** `<MapContainer>` taking `100vw` and `100vh`. Fixed position.
* **Layer 1 (Overlays):**
    * **Desktop:** Floating Sidebar (Left or Right), Width: `400px` to `480px`. Margin: `24px` from the edge. Use `bg-surface-glass` with a subtle `border border-white/10` and `shadow-2xl`.
    * **Mobile:** Bottom Sheet architecture. Map occupies the top 40-50%. The dashboard is a draggable, snap-to-grid drawer (`framer-motion` drag constraints) that can expand to 90% height.

---

## 3. Core Component Specifications

### A. Geospatial Map Engine (`<FloodMap />`)
* **Style:** Minimalist dark monochromatic map tiles (no labels/clutter).
* **Nodes (Hardware AI Stations):** Render custom HTML markers. 
    * *Default state:* 8px solid dot with a 16px low-opacity halo.
    * *Active state:* Add standard CSS `@keyframes ping` or Framer Motion repeating scale animation for nodes actively reporting data.
* **Polygons (Risk Zones):** Render GeoJSON areas. Fill opacity `0.3`, stroke width `2px`. Stroke and fill colors must map to the Semantic Alert Tiers.

### B. Intelligence Sidebar (`<TelemetryDashboard />`)
Use a "Bento-Box" CSS Grid layout for internal components. Gap: `1rem`, Padding: `1.5rem`.

* **Header:** Logo, "Public Monitoring Portal" text, and an animated "Live" status indicator (blinking green dot + "System Online").
* **Component 1: National Risk Summary (Grid Span 2)**
    * Row of minimalist stat cards: "Active Warnings" (Red), "Watch Areas" (Yellow), "Active Nodes" (Cyan).
    * Large numeric display using the Monospace font.
* **Component 2: Live Node Telemetry (Conditional Render)**
    * Appears when a map node is clicked.
    * Includes a minimalist `<AreaChart>` (using Recharts or similar). Hide grid lines, show smooth curves. Fill with gradient based on water level severity.
* **Component 3: Public Alerts Feed**
    * Vertically scrollable list (`overflow-y-auto`, hidden scrollbar).
    * Cards with timestamps, location, and Semantic Badge (`Watch`, `Warning`, `Critical`).
    * *Interaction:* Clicking a card triggers a map `flyTo()` transition.

### C. Community Reporting Widget (`<GeminiVisionUploader />`)
Positioned at the bottom of the sidebar or as a floating FAB action.

* **Idle State:** Dashed border, translucent background. Icon: Camera + Map Pin. Text: "Submit Field Report".
* **Upload State:** Display captured geolocation (Lat/Long in monospace) next to the thumbnail.
* **Processing State:** Replace thumbnail with a `<Skeleton />` shimmer loader (simulating AI inference). Add text: "Analyzing severity & infrastructure impact..."
* **Optimistic Success State:** Immediate UI feedback displaying a "Verification Pending" checkmark, and a temporary pin dropped on the main map.

---

## 4. Animation & Interaction Directives (Framer Motion)
* **Staggered Entrance:** When the sidebar loads, child Bento cards should stagger in (`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ staggerChildren: 0.1 }}`).
* **Hover States:** Button and card hovers should not scale drastically. Use subtle brightness increases and border-color transitions (`hover:border-white/30 hover:bg-white/5`).
* **Micro-interactions:** Data numbers should animate-count up on initial load.
