# OEE Command Center

Cinematic, scroll-driven industrial OEE monitoring dashboard. Next.js 16 (App Router) + TypeScript + Tailwind v4, React Three Fiber / drei for 3D, GSAP ScrollTrigger + Lenis for scroll storytelling, Recharts for analytics.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production check:

```bash
npm run build
npm run start -- -p 4173
```

Node 18+ recommended. No external API keys needed — everything runs on mock data.

## What's built

- **Homepage (`/`)** — pinned 3D scroll journey (GSAP ScrollTrigger, ~420vh):
  Scene 1 factory awakens -> Scene 2 A x P x Q rings align into company OEE ->
  Scene 3 split into Sector 25 / IMT ecosystems, followed by normal-scroll
  DOM sections: aggregated OEE per group (Scene 4/5), executive comparison
  charts (Scene 6), and a 7-plant node grid (Scene 7) linking into dashboards.
- **Plant dashboards (`/plants/[slug]`)** — one reusable template for all 7
  plants (`sector-25-forging`, `sector-25-cnc`, `sector-25-vmc`, `sector-69`,
  `sector-58`, `unit-94`, `unit-97`): 3D hero object, cinematic month
  timeline, A/P/Q data-entry form with live OEE preview, dynamic downtime
  category editor, and a full analytics section (trend, A/P/Q trend, MoM
  change, component comparison, downtime trend, OEE-vs-downtime, downtime
  donut).

## Architecture for the backend agent

- `src/types` — all domain interfaces (`Plant`, `MonthlyOEEData`,
  `DowntimeData`, `DowntimeCategory`, `PlantGroup`, ...).
- `src/data` — static plant/group registry + deterministic mock data
  generator (`mockOee.ts`).
- `src/services` — **the integration seam**. `oeeService.ts`,
  `downtimeService.ts`, `plantService.ts` currently read/write the in-memory
  mock store. Every UI component calls these functions, never the mock data
  directly — swap the function bodies for real API/database calls and the
  UI keeps working unchanged.
- `src/components/three` — reusable R3F primitives (factory geometry,
  particle streams, A/P/Q rings, per-plant mechanical objects).
- `src/components/charts` — Recharts wrappers themed for the dark
  industrial UI.
- `src/components/plant` — plant dashboard building blocks (hero, month
  timeline, both entry forms, analytics composition).
- `src/components/sections` — homepage scroll sections.

## Notes

- Mock data is deterministic (seeded, not `Math.random`) so SSR/CSR never
  mismatch and reloads look stable.
- `saveMonthlyOEE` / `saveDowntime` currently mutate the in-memory mock DB
  for the session — ready to be pointed at a real persistence layer.
- 3D scenes use primitive geometries (boxes, torus, icosahedron) rather than
  external GLTF assets, so there are zero binary/model dependencies to host.
- Tailwind v4 (`@import "tailwindcss"`) — no `tailwind.config.js` needed for
  the base setup; theme tokens live in `globals.css`.
