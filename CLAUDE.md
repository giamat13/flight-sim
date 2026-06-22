# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**flight-sim** is a web-based flight simulator built with React and Vite. The app renders an interactive 3D flight simulator using HTML5 Canvas inside a React component, complete with a HUD (heads-up display) showing altitude, speed, heading, and other flight instruments.

## Build, Dev, and Test Commands

```bash
# Start dev server (http://localhost:5173/flight-sim/)
npm run dev

# Build for production
npm run build

# Lint code (ESLint)
npm run lint

# Fix linting issues
npm run lint:fix

# Type check (via TypeScript on jsconfig.json)
npm run typecheck

# Preview production build
npm run preview
```

## Project Architecture

### Frontend Stack
- **React 18** - UI framework
- **Vite** - Bundler and dev server
- **Tailwind CSS** - Styling with custom dark mode
- **Radix UI** - Accessible component library (all components in `src/components/ui/`)
- **React Router** - Client-side routing
- **React Query (TanStack)** - Data fetching and caching
- **Framer Motion** - Animations
- **Three.js** - 3D graphics (installed but primary 3D is canvas-based)
- **Lucide React** - Icons
- **Zod** - Schema validation
- **React Hook Form** - Form management

### Project Structure

```
src/
├── main.jsx                 # App entry point
├── App.jsx                  # Main router setup with React Query provider
├── index.css               # Global styles
├── pages/
│   └── FlightSimulator.jsx  # Main flight simulator page with embedded iframe
├── components/
│   ├── ui/                 # Radix UI component wrappers (44+ components)
│   ├── ScrollToTop.jsx     # Route change handler
│   └── [other components]
├── lib/
│   ├── utils.js            # Utility functions
│   ├── query-client.js     # React Query setup
│   ├── PageNotFound.jsx    # 404 page
│   └── [other libs]
├── hooks/
│   └── use-mobile.jsx      # Mobile detection hook
└── utils/
    └── index.ts            # Additional utilities
```

### Key Implementation Details

1. **FlightSimulator Page**: Creates an iframe and injects a self-contained HTML document with canvas-based flight simulation. The simulator includes:
   - 3D terrain rendering
   - Flight physics (pitch, bank, altitude, airspeed, heading)
   - HUD with green monochrome aesthetic
   - Artificial Horizon Indicator (AHI)
   - Compass display
   - Throttle control bar
   - Stall and terrain warning systems

2. **Routing**: Single-page application with React Router, basename set to `/flight-sim`

3. **Component Library**: Extensive use of Radix UI components (accordion, alerts, buttons, forms, etc.) wrapped with Tailwind styling

4. **Query Client**: Centralized React Query setup for consistent data-fetching patterns

## Configuration Files

- **vite.config.js** - Vite config with React plugin and `@` alias for `src/`
- **jsconfig.json** - JavaScript path configuration (JSX, module resolution, etc.)
- **tailwind.config.js** - Tailwind CSS theme extensions and custom colors (sidebar, chart, etc.)
- **eslint.config.js** - Flat ESLint config enforcing React/hooks best practices and unused import cleanup
- **package.json** - Dependencies and npm scripts

## ESLint & Linting

- ESLint covers `src/components/`, `src/pages/`, and `Layout.jsx` only
- Ignores `src/lib/**/*` and `src/components/ui/**/*`
- Enforces React Hooks rules, removes unused imports, requires JSX files to use React
- Run `npm run lint:fix` to auto-fix issues

## Type Checking

TypeScript configuration via jsconfig.json with `checkJs: true`. Includes `src/components/**/*.js`, `src/pages/**/*.jsx`, and `Layout.jsx`. Run `npm run typecheck` before committing to ensure no type errors.

## Common Patterns

- **UI Components**: All Radix UI wrappers are in `src/components/ui/` and composed with Tailwind classes
- **Dark Mode**: Configured via `darkMode: ["class"]` in Tailwind
- **Data Fetching**: Use React Query with the `queryClientInstance` from `lib/query-client.js`
- **Forms**: Use React Hook Form with Zod schema validation via `@hookform/resolvers`
- **Routing**: All routes defined in `App.jsx`; add new pages in `src/pages/` and import them

## Deployment

- Base path is `/flight-sim/` (configured in vite.config.js and React Router)
- GitHub Pages deployment configured (based on recent commits)
- Build output goes to `dist/`
