# Flight Simulator

A web-based flight simulator built with React and Vite. Experience realistic flight physics with an authentic cockpit heads-up display (HUD) and comprehensive flight instruments.

## Features

- **3D Flight Physics** - Realistic aircraft dynamics including pitch, roll, altitude, and airspeed
- **Authentic HUD** - Green monochrome cockpit display with flight data
- **Flight Instruments**:
  - Artificial Horizon Indicator (AHI)
  - Compass
  - Altitude, Speed, Heading, Vertical Speed, and Throttle indicators
- **Warning Systems** - Stall warnings and terrain proximity alerts
- **Smooth Controls** - Keyboard controls for intuitive flight operation
- **Visual Effects** - Scanlines and vignette for authentic CRT monitor aesthetic

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd flight-sim

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/flight-sim/`

### Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Usage

### Controls

| Key | Action |
|-----|--------|
| ↑↓ | Pitch (nose up/down) |
| ←→ | Bank (roll left/right) |
| W/S | Throttle (increase/decrease) |
| C | Switch camera view |
| R | Reset flight |

### Flight Instruments

- **ALT** - Altitude in feet
- **SPD** - Airspeed in knots
- **HDG** - Heading (0-360°)
- **V/S** - Vertical speed (rate of climb/descent)
- **THR** - Throttle percentage

## Project Structure

```
flight-sim/
├── src/
│   ├── pages/
│   │   └── FlightSimulator.jsx       # Main simulator component
│   ├── components/
│   │   ├── ui/                        # Radix UI component library
│   │   └── ScrollToTop.jsx
│   ├── lib/
│   │   ├── query-client.js            # React Query configuration
│   │   └── utils.js
│   ├── hooks/
│   │   └── use-mobile.jsx
│   ├── App.jsx                        # Main app router
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── eslint.config.js                   # ESLint rules
├── jsconfig.json                      # JavaScript/JSX configuration
└── package.json                       # Dependencies and scripts
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Next generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Router** - Client-side routing
- **React Query** - Data fetching library
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics library

## Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues automatically
npm run typecheck   # Check for TypeScript errors
```

## Linting & Quality

- **ESLint** - Enforces React best practices and clean code
- **TypeScript Check** - Validates JavaScript code with TypeScript
- **Unused Imports** - Automatically removes unused imports

Run linting before committing:

```bash
npm run lint:fix
npm run typecheck
```

## Deployment

The application is deployed to GitHub Pages at `/flight-sim/` path.

```bash
# Build for production
npm run build

# Push to main branch to trigger GitHub Pages deployment
git push origin main
```

## Browser Support

Works on all modern browsers supporting:
- HTML5 Canvas
- ES6+ JavaScript
- CSS Grid & Flexbox

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint:fix` and `npm run typecheck`
4. Commit with clear messages
5. Push and create a pull request

## License

MIT

## Troubleshooting

### Dev server not starting
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use
Vite will automatically use the next available port. Check the terminal output for the actual URL.

### Build fails
```bash
# Clear Vite cache
rm -rf dist .vite
npm run build
```

## Keyboard Shortcuts

- **↑/↓** - Control pitch
- **←/→** - Control bank/roll
- **W/S** - Adjust throttle
- **C** - Toggle camera/view
- **R** - Reset to initial state

## Performance

The simulator runs at 60 FPS with optimized canvas rendering and efficient physics calculations.

---

For more information on development practices, see [CLAUDE.md](./CLAUDE.md).
