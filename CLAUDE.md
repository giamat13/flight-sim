# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Flight Simulator** is a web-based 3D flight simulator running entirely in a single HTML file (`public/simulator.html`). It renders real-world terrain using Three.js with Esri imagery, AWS elevation data, and OSM/Overpass building data (all keyless APIs). The simulator includes realistic flight physics, autopilot, terrain collision detection, traffic models, and a green-monochrome HUD.

## Architecture

### Single-File Design
- **Main app**: `public/simulator.html` (~5700 lines) — the entire application
- **Entry point**: `index.html` — a thin wrapper that iframes `simulator.html` for Google Analytics
- **Vite config**: Serves at `/flight-sim/` base path; Cesium has been removed in favor of hand-built Three.js rendering

### Core Structure in simulator.html
1. **Inline CSS** (lines 10–183) — styling for HUD, panels, warnings, touch controls, menus
2. **HTML structure** (lines 186–403) — canvas, HUD panels, menus, overlays
3. **ES module** (line 404+) — self-contained JavaScript IIFE with all flight logic, rendering, and UI

### Key JavaScript Sections (representative, not exhaustive)
- **Three.js initialization** — `initThree()`, loads terrain tiles, cameras, scene
- **Physics simulation** — `update(dt)` handles aircraft dynamics, autopilot, collision detection
- **Rendering** — `render()` draws 3D scene and 2D canvas overlays (HUD, AHI, compass, warnings)
- **UI state & menus** — start menu, pause, autopilot panel, nav map picker
- **Input handling** — keyboard, gamepad, touch controls
- **Warnings & indicators** — stall, overspeed, terrain collision, fuel, landing feedback

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (opens http://localhost:5173/flight-sim/)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Important Notes for Editing

### When Modifying simulator.html
- **Line 404** marks `<script type="module">` — all JavaScript after this is the single ES module
- The module is wrapped in an async IIFE that immediately calls `loop()` at the end
- Avoid adding script tags or external module imports; the file is self-contained
- All data (imagery, tiles) must use keyless public APIs or be fetched at runtime

### Physics & State
- Global `state` object tracks aircraft position, attitude, speed, altitude, fuel, etc.
- Physics timestep is dt (typically ~16ms at 60 FPS)
- Autopilot modes: altitude hold, heading hold, nav-to-point (via double-press AP + map picker)
- Terrain collision immediately sets `state.terrainHit = true` and triggers crash screen

### HUD & Canvas Rendering
- Primary 3D scene rendered by Three.js to `#three-container`
- 2D canvas overlays (gauges, warnings, toast messages) drawn to `#sim-canvas`
- HUD elements use `rgba(0,255,65,...)` green (#00FF41) for monochrome cockpit aesthetic
- Scanlines and vignette applied via CSS for CRT monitor effect

### UI Menus & Flows
1. **Start menu** (`#startmenu`) — select departure airport or custom geolocation
2. **Simulation ready** — terrain spawned, aircraft positioned
3. **In-flight** — HUD active, pause/resume available, AP control panel optional
4. **Landing/crash** — landing panel shows summary; restart via menu

### Advanced Features
- **Autopilot** — toggled with space; double-press opens nav map picker (slippy map)
- **Map picker** — drag to pan, zoom +/−, search for ICAO or coordinates, "GO" to navigate
- **Traffic models** — 3D aircraft rendered alongside the player
- **Terrain avoidance** — autopilot climbs during cruise to avoid hills
- **Gamepad support** — D-pad drives AP knobs (HDG/SPD/ALT), buttons for menu/AP toggle

### Coordinate System & Geospatial
- World position: `state.lat`, `state.lon` (WGS84)
- Ground-relative frame: North, East, Down (N/E/D)
- Altitude in feet, ground elevation fetched from AWS tiles
- Heading 0–360°, pitch/roll in degrees

## File Locations
- `vite.config.js` — simple config; base is `/flight-sim/` for GitHub Pages
- `package.json` — dependencies: Vite, @vitejs/plugin-basic-ssl, Cesium (not used)
- `.claude/settings.json` — Claude Code configuration (if present)
- `README.md` — outdated documentation; refer to the code as the source of truth

## Testing & Verification
- No automated tests; changes should be verified in the browser
- Dev server: `npm run dev` opens `http://localhost:5173/flight-sim/` automatically
- Test critical flows: takeoff, landing, terrain avoidance, autopilot, menu navigation
- Check HUD updates, warning triggers, and 3D rendering on different zoom levels

## Troubleshooting
- **Port 5173 in use**: Vite will use the next available port; check terminal output
- **Terrain not loading**: Check browser console; Esri/AWS APIs may be rate-limited or blocked
- **Gamepad not detected**: Browser must have focus; some gamepads require driver updates
- **Build fails**: Clear `.vite` cache (`rm -rf .vite dist` on Unix, PowerShell equivalent on Windows) and rebuild

## Future Architecture Notes
- The single-file approach is intentional (easy deployment, no build step dependency for end user)
- Three.js is loaded from CDN inside the module; no bundler needed for the app itself
- Vite is used only for dev server and production build optimization
- Consider breaking into separate files only if the file grows significantly or modularization becomes critical
