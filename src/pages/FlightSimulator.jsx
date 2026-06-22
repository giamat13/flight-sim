import React from "react";

// The simulator itself is a self-contained HTML document served as a real
// static file (public/simulator.html). It must be loaded over a real HTTP
// origin — not srcdoc/Blob — because CesiumJS relies on Web Workers, WebGL and
// IndexedDB, which break under an opaque (null) origin.
const SIM_URL = `${import.meta.env.BASE_URL}simulator.html`;

export default function FlightSimulator() {
  return (
    <iframe
      title="Flight Simulator"
      src={SIM_URL}
      // allow geolocation so the "My Location" start option works
      allow="geolocation"
      // give the iframe keyboard focus as soon as it loads (flight controls)
      onLoad={(e) => {
        try { e.currentTarget.contentWindow?.focus(); } catch { /* ignore */ }
      }}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
        background: "#0a0a0f",
      }}
    />
  );
}
