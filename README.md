# Flight Simulator

A web-based 3D flight simulator built with vanilla JavaScript and Three.js. Experience realistic flight physics, autopilot modes, and an immersive green-monochromatic cockpit HUD—all in a single self-contained HTML file.

## Features

- **Realistic Flight Physics** — Forces-based simulation including gravity, thrust, drag, and lift; realistic attitude kinematics
- **3D Terrain Rendering** — Real-world Esri imagery, AWS elevation data, and OpenStreetMap buildings streamed on-demand
- **Autopilot System** — Altitude hold, heading hold, and nav-to-point modes with automatic landing
- **Authentic Cockpit HUD** — Green monochrome display with flight instruments, warnings, and system indicators
- **Flight Instruments**:
  - Artificial Horizon Indicator (AHI) with pitch and bank
  - Digital compass with heading display
  - Altitude, airspeed, vertical speed, throttle indicators
  - Angle of attack (AOA) and G-force displays
- **Warning Systems** — Stall, overspeed, terrain proximity, fuel, and structural damage alerts
- **Multiple Control Schemes** — Keyboard, gamepad, and touch (tilt-to-steer for mobile)
- **Visual Effects** — Scanlines and vignette for authentic CRT monitor aesthetic
- **Airport Selection** — Start from any airport worldwide via ICAO code or geolocation
- **Traffic Models** — Visualize other aircraft in your airspace

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern browser with WebGL support (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/giamat13/flight-sim.git
cd flight-sim

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The simulator will automatically open at `http://localhost:5173/flight-sim/`. The page reloads on any file changes.

### Build for Production

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Usage

### Keyboard Controls

| Key | Action |
|-----|--------|
| **Space** | Toggle autopilot (single-press); open map picker (double-press) |
| **↑/↓** | Pitch (nose up/down) |
| **←→** | Bank (roll left/right) |
| **W/S** | Increase/decrease throttle |
| **E** | Start/stop engine |
| **F** | Toggle flaps |
| **G** | Toggle landing gear |
| **B** | Deploy airbrake |
| **C** | Switch camera view (chase / cockpit) |
| **R** | Reset flight |
| **P** | Pause/resume simulation |
| **[/]** | Adjust autopilot heading |
| **;/'** | Adjust autopilot altitude |
| **,/.** | Adjust autopilot speed |
| **A** | Autopilot off |

### Gamepad Controls (if available)

- **D-Pad Up/Down** — Adjust autopilot altitude
- **D-Pad Left/Right** — Adjust autopilot heading
- **Buttons** — Menu, autopilot toggle, camera, systems

### Mobile/Touch Controls

- **Tilt Device** — Control pitch and bank (if tilt mode enabled)
- **On-Screen Buttons** — Engine, flaps, gear, camera, autopilot, systems

### Flight Instruments

- **ALT** — Altitude above ground in feet
- **SPD** — True airspeed in knots
- **HDG** — Heading (0–360°)
- **V/S** — Vertical speed in feet per minute (rate of climb/descent)
- **THR** — Throttle percentage (0–100)
- **AOA** — Angle of attack in degrees
- **G** — G-force (load factor)

### Starting a Flight

1. Open the simulator in your browser
2. Select a departure airport by ICAO code (e.g., KJFK, EGLL, RJTT) or use your current location via geolocation
3. Adjust initial heading, altitude, and speed if desired
4. Click "START" to begin

### Flying the Aircraft

**Basic Takeoff:**
1. Press **E** to start the engine (engine spools up over ~10 seconds)
2. Increase throttle with **W** until airspeed reaches ~50 knots
3. Pull back on pitch (↑) to rotate; aircraft lifts off at ~65 knots
4. Maintain pitch to climb at a reasonable rate

**Cruise:**
- Use autopilot for hands-off flight: press **Space** to toggle, then adjust heading/altitude/speed with keyboard or AP panel
- Or hand-fly: maintain pitch for desired climb/descent, adjust throttle for speed

**Landing:**
- Descend to pattern altitude (~1,500 feet AGL) near the airport
- Reduce speed gradually; deploy flaps (**F**) at lower speeds
- Align with runway and touchdown gently; gear should be down
- Upon landing, you'll receive feedback via the landing panel

### Autopilot Features

- **Altitude Hold** — Maintains selected altitude; climb/descend by adjusting setpoint with **;** and **'** keys
- **Heading Hold** — Maintains selected heading; turn by adjusting with **[** and **]** keys
- **Speed Hold** — Maintains selected airspeed; adjust with **,** and **.** keys
- **Nav-to-Point** — Double-press **Space** to open the interactive map picker:
  - Drag to pan, scroll to zoom
  - Search by ICAO code (e.g., "KJFK") or coordinates (e.g., "40.7128, -74.0060")
  - Click "GO" to navigate to the waypoint; autopilot will fly direct and initiate landing

### Airport/Location Selection

At startup, enter an ICAO code (e.g., **KJFK** for JFK, **EGLL** for Heathrow) or click "USE MY LOCATION" to start from your current position. You can also search by coordinates.

## Project Structure

```
flight-sim/
├── public/
│   └── simulator.html      # The entire flight simulator application (~5700 lines)
├── index.html              # Analytics wrapper (iframes simulator.html)
├── vite.config.js          # Vite build configuration
├── package.json            # Dependencies and npm scripts
├── CLAUDE.md               # Developer documentation for Claude Code
└── README.md               # This file
```

## Architecture

**Flight Simulator** is a single self-contained HTML file with:

- **Inline CSS** — All styling for HUD, menus, warnings, and visual effects
- **HTML Structure** — Canvas elements for 3D rendering and 2D overlays
- **ES Module** — All JavaScript logic in a single async IIFE:
  - Three.js scene with terrain streaming
  - Physics simulation (forces, kinematics, autopilot)
  - 2D canvas HUD rendering
  - UI menus and input handling
  - Collision detection and warning systems

The app loads:
- **Esri World Imagery** for terrain textures
- **AWS Terrain Tiles** for elevation data
- **OpenStreetMap/Overpass** for buildings and roads

All APIs are keyless and publicly accessible; no authentication required.

For detailed developer documentation, see [CLAUDE.md](./CLAUDE.md).

## Performance

- **Target Frame Rate** — 60 FPS on desktop, 30 FPS on mobile
- **App Size** — ~150 KB gzipped (single HTML file + CDN dependencies)
- **Terrain LOD** — Tiles load/unload based on camera distance
- **Physics Timestep** — ~16ms per frame at 60 FPS

## Browser Support

Works on all modern browsers supporting:
- HTML5 Canvas & WebGL
- ES6+ JavaScript
- CSS Grid & Flexbox

**Recommended**: Chrome 90+, Firefox 88+, Safari 15+, Edge 90+

## Deployment

The application is deployed to GitHub Pages:

```bash
# Build for production
npm run build

# Commit and push to main branch
git add dist/
git commit -m "Build for production"
git push origin main
```

The app will be live at: `https://giamat13.github.io/flight-sim/`

## API Usage

All external data sources are keyless and subject to usage limits:

- **Esri Tiles** — May be rate-limited at very high request rates
- **AWS Terrain Tiles** — Free tier with reasonable limits
- **Overpass API** — Community-run; be mindful of query complexity

If you experience missing terrain or buildings, check browser console for API errors or rate-limit warnings.

## Known Limitations

- Single-player only (no multiplayer or server-side persistence)
- Limited aircraft model (realistic dynamics, but no aerodynamic tables)
- Simplified weather system (no wind or turbulence beyond basic variations)
- Mobile performance may be reduced on lower-end devices
- Terrain detail limited to available tile resolution

## Contributing

1. Read [CLAUDE.md](./CLAUDE.md) for development guidance
2. Create a feature branch from `main`
3. Make your changes to `public/simulator.html`
4. Test thoroughly in the browser (`npm run dev`)
5. Commit with a clear message describing the change
6. Push and create a pull request

## License

MIT

## Support & Troubleshooting

### Dev Server Not Starting
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 5173 Already in Use
Vite will automatically use the next available port. Check the terminal output for the actual URL.

### Terrain Not Loading
- Check browser console (F12 → Console) for network errors
- Verify internet connection is working
- Esri/AWS APIs may be temporarily rate-limited; wait a moment and refresh
- Check if you're behind a proxy that blocks these APIs

### Gamepad Not Detected
- Ensure browser has focus
- Try plugging in the gamepad after the page loads
- Some gamepads require a driver update

### Choppy Performance
- Check if other tabs are consuming resources
- Reduce browser zoom if at >100%
- Try a different browser
- Check GPU usage in DevTools Performance tab

## Credits

- **Three.js** — 3D graphics library
- **Esri** — Base imagery tiles
- **AWS** — Elevation data
- **OpenStreetMap & Overpass** — Building and road data
- Inspired by desktop flight simulators and web-based aviation tools

---

For more information, see [CLAUDE.md](./CLAUDE.md) or visit the [GitHub repository](https://github.com/giamat13/flight-sim).
