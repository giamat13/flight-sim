# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Flight Simulator** is a web-based 3D flight simulator running as a single, self-contained HTML file (`public/simulator.html`). It renders real-world terrain using Three.js, combining Esri imagery, AWS elevation data, and OpenStreetMap building data through keyless public APIs. The simulator features realistic flight physics, autopilot modes, terrain collision detection, traffic visualization, and an immersive green-monochrome HUD.

## Architecture

### Single-File Design
- **Main Application**: `public/simulator.html` (~5700 lines) — the entire flight simulator
- **Entry Point**: `index.html` — a thin wrapper that iframes `simulator.html` to track analytics via Google Analytics
- **Build Tool**: Vite (with `/flight-sim/` base path for GitHub Pages)
- **No External Dependencies**: Three.js is loaded from CDN; no npm packages needed for the app itself

### Structure of simulator.html
1. **Inline CSS** (lines ~10–650) — all styling for HUD elements, warning displays, touch controls, menus, and visual effects
2. **HTML Structure** (lines ~650–680) — canvas elements (#three-container for 3D, #sim-canvas for 2D overlays), HUD panels, menus, touch controls
3. **ES Module** (line ~651+) — single async IIFE wrapping the entire JavaScript application

### Key JavaScript Architecture (within the module)
The module is structured into logical sections but is one continuous block:

- **DOM & Canvas Setup** — references to canvas contexts for 3D rendering and 2D HUD overlays
- **Three.js Initialization** — dynamic imports of Three.js from CDN; creates scene, cameras, terrain tiles
- **Aircraft State** — `state` object tracking position (lat/lon/altitude), attitude (pitch/bank/heading), speed, fuel, systems status
- **Physics Simulation** — `update(dt)` function handles forces (gravity, thrust, drag, lift), attitude kinematics, autopilot, terrain collision
- **3D Rendering** — `render()` updates Three.js scene (terrain tiles, aircraft, traffic models, sky)
- **2D HUD Rendering** — canvas overlays for artificial horizon, compass, altimeter, vertical speed, warnings, fuel/throttle bars
- **Input Handling** — keyboard, gamepad, touch tilt controls; autopilot knob adjustments
- **Warnings & Alerts** — stall, overspeed, terrain proximity, fuel, structural damage (wing/fire/gear)
- **UI Menus & Navigation** — start menu (airport/location select), pause, autopilot panel, map picker for nav-to-point, landing screen

## Development Commands

```bash
# Install dependencies (mainly Vite and dev tools)
npm install

# Start development server at http://localhost:5173/flight-sim/
# Automatically opens browser; reloads on file changes
npm run dev

# Build for production (optimizes and bundles)
npm run build

# Preview the production build locally
npm run preview
```

## Important Notes for Editing

### When Modifying simulator.html
- **No external imports needed** — JavaScript is self-contained within `<script type="module">`; Three.js and other libraries are loaded dynamically at runtime
- **Single IIFE structure** — the module wraps all code in `(function(){...})()` to avoid polluting the global scope; immediately calls an async `loop()` function at the end
- **Line ~651** marks the start of `<script type="module">`; everything after is JavaScript
- **All data is runtime-fetched** — no pre-bundled assets; Esri imagery, AWS elevation, and OSM building data are fetched on demand via public keyless APIs

### Physics & Flight Dynamics
- **State Object** — global `state` tracks all aircraft and environmental data: position, attitude, airspeed, vertical speed, fuel, systems status
- **Physics Timestep** — `dt` is typically ~16ms at 60 FPS; physics update is in `update(dt)` function
- **Forces** — gravity, thrust, drag (speed-dependent), lift (dependent on aoa and speed); no external physics engine (hand-built)
- **Autopilot Modes**:
  - Altitude Hold: maintains `state.altitude` at selected setpoint
  - Heading Hold: maintains `state.heading` at selected bearing
  - Nav-to-Point: double-press AP + map picker to select a waypoint; autopilot flies direct to target and initiates landing
- **Terrain Collision** — continuous ground-level check; sets `state.terrainHit = true` and triggers landing/crash screen

### HUD & Rendering
- **Two-Canvas Approach**:
  - `#three-container` — Three.js 3D scene (terrain, aircraft, traffic, sky)
  - `#sim-canvas` — 2D canvas for HUD overlays (gauges, warnings, toast messages)
  - Scanlines and vignette applied via CSS for authentic CRT cockpit aesthetic
- **Color Palette** — green monochrome theme: `#00FF41` (rgb(0, 255, 65)) with varying opacity for depth
- **HUD Elements**:
  - Artificial Horizon (AHI) — pitch and bank visualization
  - Compass — rotating card with heading value
  - Altimeter, airspeed, vertical speed, throttle indicators
  - Warnings: stall, overspeed, terrain proximity, fuel, structural damage
  - Toast messages for system feedback (e.g., "Landing confirmed")

### UI Flows
1. **Start Menu** (`#startmenu`) — select departure airport by ICAO code or use geolocation; sets `START` object
2. **Loading Screen** — terrain spawning, aircraft positioning, asset loading
3. **In-Flight** — HUD active, pause/resume available (P key), autopilot control panel optional
4. **Landing/Crash** — landing panel summary, option to restart via menu

### Autopilot Features
- **Single-Press Space** — toggle autopilot on/off
- **Double-Press Space** — opens nav map picker (interactive slippy map)
  - Drag to pan, zoom with +/− buttons
  - Search by ICAO code or coordinates (e.g., "40.7128, -74.0060")
  - "GO" button to navigate direct to waypoint; autopilot flies and lands automatically
- **Knob Control** — AP panel shows heading (HDG), altitude (ALT), speed (SPD) setpoints; adjust with keyboard or gamepad
- **ECON Mode** — economy cruise; autopilot climbs gradually to avoid terrain

### Input Methods
- **Keyboard** — pitch/bank/throttle, engine start, flaps, gear, camera, autopilot
- **Gamepad** — D-pad for AP knob adjustment, buttons for menu/AP/camera/systems
- **Touch/Mobile** — tilt-to-steer, touch buttons for systems; on-screen controls activate on portrait/portrait-landscape

### Coordinate Systems
- **World Position** — `state.lat`, `state.lon` (WGS84 in decimal degrees)
- **Local Frame** — North, East, Down (N/E/D) ground-relative
- **Altitude** — feet above ground level; fetched from AWS elevation tiles
- **Heading** — 0–360°, where 0/360° = North, 90° = East, etc.
- **Attitude** — `pitch` (nose up/down), `bank` (roll left/right), in degrees

### Data Sources & APIs
All APIs are keyless and publicly accessible:
- **Terrain Imagery** — Esri World Imagery tiles
- **Elevation Data** — AWS Terrain Tiles (GEOTIFF via GDAL)
- **Buildings & Roads** — OpenStreetMap (via Overpass API)
- **No authentication required** — all requests are unauthenticated; respect API usage limits

## Testing & Verification

Since there are no automated tests, changes should always be verified in the browser:

1. **Start Dev Server** — `npm run dev` opens `http://localhost:5173/flight-sim/` automatically
2. **Test Critical Flows**:
   - Takeoff (engine start, throttle up, rotate at airspeed)
   - Cruise (autopilot altitude/heading hold, pitch/bank trim)
   - Landing (descent to target altitude, autopilot approach, touchdown)
   - Terrain Avoidance (autopilot climbs around hills)
   - Menuing (start menu, AP panel, map picker, pause/resume)
3. **Verify HUD Updates** — check that all gauges, warnings, and toast messages display correctly
4. **Check 3D Rendering** — terrain tiles load at different zoom levels, traffic models render, sky/horizon look correct
5. **Test All Input Methods** — keyboard, gamepad, touch (if on a touch device)
6. **Monitor Performance** — keep framerate at ~60 FPS; check for GPU/CPU bottlenecks in DevTools

## File Locations & Dependencies

- **vite.config.js** — minimal config; `base: '/flight-sim/'` for GitHub Pages
- **package.json** — Vite, @vitejs/plugin-basic-ssl, electron, electron-builder (cesium listed but not used)
- **public/simulator.html** — the entire application
- **index.html** — analytics wrapper (Google Analytics iframe)
- **README.md** — outdated; refer to this CLAUDE.md and the code as the source of truth
- **.claude/settings.json** — Claude Code configuration (if present; not project-specific)

## Troubleshooting

### Dev Server Issues
- **Port 5173 already in use** — Vite will try the next available port; check terminal output for the actual URL
- **Terrain not loading** — Check browser console for errors; Esri/AWS APIs may be rate-limited or blocked by CORS if behind a proxy
- **Assets (buildings, roads) missing** — Overpass API may be temporarily unavailable or rate-limited; check network tab in DevTools

### Gamepad Not Detected
- Ensure browser has focus
- Some gamepads require driver updates or may only work in full-screen mode
- Refresh the page after plugging in a gamepad

### Build Fails
```bash
# Clear Vite cache and rebuild
rm -rf dist .vite
npm run build
```

### Performance Issues
- Check DevTools Performance tab to identify bottlenecks
- Large terrain tile loads may temporarily stall the render loop; this is normal during tile streaming
- Reduce the number of traffic models if framerate drops significantly

## Architecture Notes

### Single-File Design Rationale
The single-file approach is intentional for ease of deployment and exploration. All logic is in one place, making it easy to understand the full application without jumping between modules. The file is structured with clear section comments for navigation.

### Future Scaling Considerations
If the file grows significantly (e.g., additional aircraft types, complex autopilot modes, multiplayer), consider breaking into separate files and using a bundler. However, the current monolithic structure keeps the app simple and self-contained.

### Three.js vs. Cesium
Three.js was chosen for full control over rendering and terrain streaming. Cesium was replaced because it added unnecessary overhead for a single-aircraft sim without 3D model support for complex terrain features.

### Graphics Pipeline
1. Three.js loads and streams terrain tiles based on camera position
2. Esri imagery is applied as textures; elevation data from AWS is geometry
3. OSM buildings are rendered as simple extruded geometries
4. 2D canvas overlays (HUD) are composited on top in the render loop
5. CSS scanlines and vignette add the cockpit aesthetic

## Performance Targets
- **Frame Rate** — 60 FPS on desktop, 30 FPS on mobile
- **Terrain LOD** — tiles load/unload based on camera distance; no preloading of distant tiles
- **Physics Timestep** — ~16ms per frame at 60 FPS; physics is stable at higher timesteps
- **Network** — terrain tiles are streamed on demand; total app size is ~150 KB (gzipped)
