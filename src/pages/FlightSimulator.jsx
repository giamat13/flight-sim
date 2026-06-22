import React, { useEffect, useRef } from "react";

export default function FlightSimulator() {
  const containerRef = useRef(null);

  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.display = "block";
    
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(iframe);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flight Simulator</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#0a0a0f;font-family:'JetBrains Mono',monospace;cursor:none}
#sim-canvas{display:block;width:100%;height:100%}
#scanlines{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)}
#vignette{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:11;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.4) 75%,rgba(0,0,0,0.85) 100%)}
#hud{position:fixed;bottom:0;left:0;right:0;pointer-events:none;z-index:20;display:flex;justify-content:center;padding:0 20px 20px}
.hud-panel{background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.3);border-radius:4px;padding:10px 18px;color:#00FF41;font-size:13px;font-family:'JetBrains Mono',monospace;display:flex;gap:28px;align-items:center;backdrop-filter:blur(2px);box-shadow:0 0 20px rgba(0,255,65,0.05),inset 0 0 30px rgba(0,255,65,0.02)}
.hud-item{display:flex;flex-direction:column;align-items:center;gap:2px}
.hud-label{font-size:9px;letter-spacing:2px;opacity:0.5;font-weight:300}
.hud-value{font-size:18px;font-weight:500;letter-spacing:1px;text-shadow:0 0 8px rgba(0,255,65,0.4)}
#ahi-container{position:fixed;top:16px;left:50%;transform:translateX(-50%);pointer-events:none;z-index:20}
#ahi-canvas{border:1px solid rgba(0,255,65,0.3);border-radius:50%;background:rgba(0,255,65,0.03);box-shadow:0 0 20px rgba(0,255,65,0.06)}
#stall-warn{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:30;font-size:48px;font-weight:700;color:#ff2020;text-shadow:0 0 30px rgba(255,0,0,0.6);font-family:'JetBrains Mono',monospace;letter-spacing:6px;pointer-events:none;display:none}
#terrain-warn{position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);z-index:30;pointer-events:none;display:none;text-align:center}
#terrain-warn .tw-main{font-size:42px;font-weight:700;color:#ff4400;text-shadow:0 0 30px rgba(255,68,0,0.6);font-family:'JetBrains Mono',monospace;letter-spacing:4px}
#terrain-warn .tw-sub{font-size:14px;color:rgba(255,68,0,0.6);margin-top:8px;font-family:'JetBrains Mono',monospace}
#controls-hint{position:fixed;top:16px;left:16px;z-index:20;pointer-events:none;color:rgba(0,255,65,0.25);font-size:10px;font-family:'JetBrains Mono',monospace;line-height:1.8;letter-spacing:1px}
#throttle-bar-container{position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:20;pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:4px}
#throttle-bar-bg{width:8px;height:140px;background:rgba(0,255,65,0.06);border:1px solid rgba(0,255,65,0.2);border-radius:4px;position:relative;overflow:hidden}
#throttle-bar-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,255,65,0.5),rgba(0,255,65,0.2));border-radius:0 0 3px 3px;transition:height 0.15s}
.thr-label{font-size:8px;color:rgba(0,255,65,0.4);letter-spacing:2px;font-family:'JetBrains Mono',monospace}
#compass{position:fixed;top:140px;left:50%;transform:translateX(-50%);z-index:20;pointer-events:none}
#compass-canvas{border:1px solid rgba(0,255,65,0.15);border-radius:4px;background:rgba(0,255,65,0.02)}
#cam-label{position:fixed;top:16px;right:16px;z-index:20;pointer-events:none;color:rgba(0,255,65,0.6);font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:2px;background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.2);border-radius:4px;padding:4px 10px}
@keyframes flash{0%,100%{opacity:1}50%{opacity:0}}
.flashing{animation:flash 0.4s infinite}
</style>
</head>
<body>
<canvas id="sim-canvas"></canvas>
<div id="scanlines"></div>
<div id="vignette"></div>

<div id="ahi-container">
  <canvas id="ahi-canvas" width="120" height="120"></canvas>
</div>

<div id="compass">
  <canvas id="compass-canvas" width="200" height="28"></canvas>
</div>

<div id="hud">
  <div class="hud-panel">
    <div class="hud-item"><span class="hud-label">ALT</span><span class="hud-value" id="hud-alt">1000</span></div>
    <div class="hud-item"><span class="hud-label">SPD</span><span class="hud-value" id="hud-spd">120</span></div>
    <div class="hud-item"><span class="hud-label">HDG</span><span class="hud-value" id="hud-hdg">360</span></div>
    <div class="hud-item"><span class="hud-label">V/S</span><span class="hud-value" id="hud-vs">+0</span></div>
    <div class="hud-item"><span class="hud-label">THR</span><span class="hud-value" id="hud-thr">50%</span></div>
  </div>
</div>

<div id="throttle-bar-container">
  <span class="thr-label">THR</span>
  <div id="throttle-bar-bg"><div id="throttle-bar-fill"></div></div>
</div>

<div id="stall-warn" class="flashing">STALL</div>
<div id="terrain-warn"><div class="tw-main">TERRAIN</div><div class="tw-sub">PULL UP</div></div>

<div id="cam-label">COCKPIT</div>
<div id="controls-hint">
  ↑↓ PITCH<br>←→ BANK<br>W/S THROTTLE<br>C CAMERA<br>R RESET
</div>

<script>
(function(){
const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const ahiCanvas = document.getElementById('ahi-canvas');
const ahiCtx = ahiCanvas.getContext('2d');
const compassCanvas = document.getElementById('compass-canvas');
const compassCtx = compassCanvas.getContext('2d');

const hudAlt = document.getElementById('hud-alt');
const hudSpd = document.getElementById('hud-spd');
const hudHdg = document.getElementById('hud-hdg');
const hudVs = document.getElementById('hud-vs');
const hudThr = document.getElementById('hud-thr');
const stallWarn = document.getElementById('stall-warn');
const terrainWarn = document.getElementById('terrain-warn');
const thrFill = document.getElementById('throttle-bar-fill');

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Aircraft state
let state = {
  altitude: 1000,
  speed: 120,
  heading: 0,
  pitch: 0,
  bank: 0,
  throttle: 50,
  vs: 0,
  gridOffset: 0,
  terrainHit: false,
  terrainTimer: 0
};

function resetState() {
  state.altitude = 1000;
  state.speed = 120;
  state.heading = 0;
  state.pitch = 0;
  state.bank = 0;
  state.throttle = 50;
  state.vs = 0;
  state.gridOffset = 0;
  state.terrainHit = false;
  state.terrainTimer = 0;
  terrainWarn.style.display = 'none';
}

const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; if (e.key === 'c' || e.key === 'C') { cameraMode = (cameraMode + 1) % 2; } e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key] = false; });

const STALL_SPEED = 60;
const MAX_SPEED = 450;
const GRID_SPACING = 80;

let lastTime = performance.now();
let cameraMode = 0; // 0=cockpit, 1=chase

function update(dt) {
  if (state.terrainHit) {
    state.terrainTimer -= dt;
    if (state.terrainTimer <= 0) resetState();
    return;
  }

  // Controls
  const pitchRate = 30;
  const bankRate = 45;
  const throttleRate = 30;

  if (keys['ArrowUp']) state.pitch = Math.min(state.pitch + pitchRate * dt, 35);
  if (keys['ArrowDown']) state.pitch = Math.max(state.pitch - pitchRate * dt, -25);
  if (keys['ArrowLeft']) state.bank = Math.max(state.bank - bankRate * dt, -60);
  if (keys['ArrowRight']) state.bank = Math.min(state.bank + bankRate * dt, 60);
  if (keys['w'] || keys['W']) state.throttle = Math.min(state.throttle + throttleRate * dt, 100);
  if (keys['s'] || keys['S']) state.throttle = Math.max(state.throttle - throttleRate * dt, 0);
  if (keys['r'] || keys['R']) resetState();

  // Bank auto-center (gentle)
  if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
    state.bank *= Math.pow(0.3, dt);
    if (Math.abs(state.bank) < 0.5) state.bank = 0;
  }

  // Pitch auto-center (very gentle)
  if (!keys['ArrowUp'] && !keys['ArrowDown']) {
    state.pitch *= Math.pow(0.6, dt);
    if (Math.abs(state.pitch) < 0.3) state.pitch = 0;
  }

  // Heading change from bank
  state.heading += state.bank * 0.6 * dt;
  if (state.heading < 0) state.heading += 360;
  if (state.heading >= 360) state.heading -= 360;

  // Speed: throttle drives it, drag slows it
  const targetSpeed = state.throttle * 4.5;
  const drag = 0.02 + Math.abs(state.pitch) * 0.002;
  state.speed += (targetSpeed - state.speed) * drag * dt * 3;
  state.speed = Math.max(0, Math.min(MAX_SPEED, state.speed));

  // Vertical speed
  const isStall = state.speed < STALL_SPEED;
  if (isStall) {
    state.vs = -800 - (STALL_SPEED - state.speed) * 20;
  } else {
    const pitchEffect = state.pitch * 25;
    const speedFactor = Math.max(0, (state.speed - STALL_SPEED) / (200 - STALL_SPEED));
    state.vs = pitchEffect * Math.min(speedFactor, 1.5);
  }

  // Altitude
  state.altitude += state.vs * dt / 60;
  
  if (state.altitude <= 0) {
    state.altitude = 0;
    state.terrainHit = true;
    state.terrainTimer = 2;
    terrainWarn.style.display = 'block';
  }

  // Grid scroll
  state.gridOffset += state.speed * 0.8 * dt;
}

function drawSky(horizonY, bankRad) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-bankRad);
  ctx.translate(-W / 2, -H / 2);

  const skyGrad = ctx.createLinearGradient(0, horizonY - H, 0, horizonY);
  skyGrad.addColorStop(0, '#0a0e2a');
  skyGrad.addColorStop(0.3, '#0f1845');
  skyGrad.addColorStop(0.7, '#1a3060');
  skyGrad.addColorStop(1, '#2a5080');
  
  ctx.fillStyle = skyGrad;
  ctx.fillRect(-W, -H * 2, W * 3, horizonY + H * 2);

  ctx.restore();
}

function drawGround(horizonY, bankRad) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-bankRad);
  ctx.translate(-W / 2, -H / 2);

  // Ground fill
  const gndGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + H * 2);
  gndGrad.addColorStop(0, '#1a3a1a');
  gndGrad.addColorStop(0.3, '#0f2a0f');
  gndGrad.addColorStop(1, '#061206');
  ctx.fillStyle = gndGrad;
  ctx.fillRect(-W, horizonY, W * 3, H * 3);

  ctx.restore();
}

function drawGrid(horizonY, bankRad) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-bankRad);
  ctx.translate(-W / 2, -H / 2);

  const focalLen = H * 0.8;
  const camHeight = Math.max(10, state.altitude * 0.15 + 30);
  const headingRad = state.heading * Math.PI / 180;
  const gridOff = state.gridOffset % GRID_SPACING;

  ctx.strokeStyle = 'rgba(0,255,65,0.12)';
  ctx.lineWidth = 1;

  // Draw forward lines (z-direction)
  const numForwardLines = 40;
  for (let i = 0; i < numForwardLines; i++) {
    const z = (i * GRID_SPACING + GRID_SPACING - gridOff);
    if (z <= 0) continue;
    const screenY = horizonY + (focalLen * camHeight) / z;
    if (screenY > H * 2 || screenY < horizonY) continue;

    const fade = Math.max(0, 1 - i / numForwardLines);
    ctx.globalAlpha = fade * 0.5;
    ctx.beginPath();
    ctx.moveTo(-W, screenY);
    ctx.lineTo(W * 2, screenY);
    ctx.stroke();
  }

  // Draw lateral lines (x-direction)
  const numLateralLines = 30;
  for (let i = -numLateralLines; i <= numLateralLines; i++) {
    const worldX = i * GRID_SPACING - (headingRad * 400) % GRID_SPACING;
    
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    
    let started = false;
    for (let j = 1; j < numForwardLines; j++) {
      const z = j * GRID_SPACING + GRID_SPACING - gridOff;
      if (z <= 0) continue;
      const screenY = horizonY + (focalLen * camHeight) / z;
      const screenX = W / 2 + (worldX * focalLen) / z;
      
      if (!started) {
        ctx.moveTo(screenX, screenY);
        started = true;
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawHorizonLine(horizonY, bankRad) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-bankRad);
  ctx.translate(-W / 2, -H / 2);

  ctx.strokeStyle = 'rgba(0,255,65,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-W, horizonY);
  ctx.lineTo(W * 2, horizonY);
  ctx.stroke();

  // Glow
  ctx.strokeStyle = 'rgba(0,255,65,0.08)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-W, horizonY);
  ctx.lineTo(W * 2, horizonY);
  ctx.stroke();

  ctx.restore();
}

function drawCrosshair() {
  const cx = W / 2;
  const cy = H / 2;
  
  ctx.strokeStyle = 'rgba(0,255,65,0.35)';
  ctx.lineWidth = 1.5;

  // Center dot
  ctx.fillStyle = 'rgba(0,255,65,0.5)';
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Wings
  ctx.beginPath();
  ctx.moveTo(cx - 40, cy);
  ctx.lineTo(cx - 15, cy);
  ctx.lineTo(cx - 15, cy + 6);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 40, cy);
  ctx.lineTo(cx + 15, cy);
  ctx.lineTo(cx + 15, cy + 6);
  ctx.stroke();
}

function drawPitchLadder(bankRad) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-bankRad);

  const pixPerDeg = 6;
  ctx.strokeStyle = 'rgba(0,255,65,0.15)';
  ctx.fillStyle = 'rgba(0,255,65,0.3)';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.lineWidth = 1;

  for (let deg = -20; deg <= 30; deg += 5) {
    if (deg === 0) continue;
    const y = -(deg - state.pitch) * pixPerDeg;
    if (Math.abs(y) > H * 0.35) continue;

    const halfW = deg % 10 === 0 ? 35 : 18;
    const isDashed = deg < 0;

    if (isDashed) {
      ctx.setLineDash([4, 4]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(-halfW, y);
    ctx.lineTo(halfW, y);
    ctx.stroke();

    if (deg % 10 === 0) {
      ctx.fillText(deg.toString(), halfW + 16, y + 3);
      ctx.fillText(deg.toString(), -halfW - 16, y + 3);
    }
  }
  ctx.setLineDash([]);
  ctx.restore();
}

function drawAirplane() {
  // === 3D Airplane Model ===
  // Coordinate system: X=right, Y=up, Z=forward (nose)
  const verts = [];
  const faces = [];
  const sides = 6;

  function addSection(z, r) {
    const startIdx = verts.length;
    if (r <= 0.01) { verts.push([0, 0, z]); return [startIdx]; }
    const indices = [];
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 + Math.PI / 6;
      indices.push(startIdx + i);
      verts.push([Math.cos(a) * r, Math.sin(a) * r, z]);
    }
    return indices;
  }

  // Fuselage sections (nose to tail)
  const sec0 = addSection(3.0, 0);
  const sec1 = addSection(2.0, 0.30);
  const sec2 = addSection(0.5, 0.40);
  const sec3 = addSection(-1.0, 0.32);
  const sec4 = addSection(-2.5, 0.12);
  const fSecs = [sec0, sec1, sec2, sec3, sec4];
  const fusCol = [0.35, 0.43, 0.50];

  for (let s = 0; s < fSecs.length - 1; s++) {
    const a = fSecs[s], b = fSecs[s + 1];
    if (a.length === 1) {
      for (let i = 0; i < b.length; i++) {
        const ni = (i + 1) % b.length;
        faces.push({ v: [a[0], b[i], b[ni]], c: fusCol });
      }
    } else if (b.length === 1) {
      for (let i = 0; i < a.length; i++) {
        const ni = (i + 1) % a.length;
        faces.push({ v: [a[i], a[ni], b[0]], c: fusCol });
      }
    } else {
      for (let i = 0; i < a.length; i++) {
        const ni = (i + 1) % a.length;
        faces.push({ v: [a[i], a[ni], b[ni], b[i]], c: fusCol });
      }
    }
  }

  // Wings with thickness
  const wt = 0.06;
  const wCol = [0.25, 0.32, 0.38];
  function addWing(side) {
    const s = side;
    const rLE = verts.length; verts.push([s*0.35, wt, 0.6]);
    const rTE = verts.length; verts.push([s*0.35, wt, -0.4]);
    const tLE = verts.length; verts.push([s*3.0, wt, -0.1]);
    const tTE = verts.length; verts.push([s*3.0, wt, -0.8]);
    const rLEb = verts.length; verts.push([s*0.35, -wt, 0.6]);
    const rTEb = verts.length; verts.push([s*0.35, -wt, -0.4]);
    const tLEb = verts.length; verts.push([s*3.0, -wt, -0.1]);
    const tTEb = verts.length; verts.push([s*3.0, -wt, -0.8]);
    faces.push({ v: [rLE, tLE, tTE, rTE], c: wCol });
    faces.push({ v: [rLEb, rTEb, tTEb, tLEb], c: [wCol[0]*0.65, wCol[1]*0.65, wCol[2]*0.65] });
    faces.push({ v: [tLE, tLEb, tTEb, tTE], c: [wCol[0]*0.8, wCol[1]*0.8, wCol[2]*0.8] });
    faces.push({ v: [rLE, rLEb, tLEb, tLE], c: [wCol[0]*0.85, wCol[1]*0.85, wCol[2]*0.85] });
    faces.push({ v: [rTE, tTE, tTEb, rTEb], c: [wCol[0]*0.72, wCol[1]*0.72, wCol[2]*0.72] });
    return { tip: tLE };
  }
  const lwTips = addWing(-1);
  const rwTips = addWing(1);

  // Horizontal stabilizer
  function addHS(side) {
    const s = side;
    const rLE = verts.length; verts.push([s*0.15, 0.03, -2.2]);
    const rTE = verts.length; verts.push([s*0.15, 0.03, -2.5]);
    const tLE = verts.length; verts.push([s*1.1, 0.03, -2.4]);
    const tTE = verts.length; verts.push([s*1.1, 0.03, -2.6]);
    const rLEb = verts.length; verts.push([s*0.15, -0.03, -2.2]);
    const rTEb = verts.length; verts.push([s*0.15, -0.03, -2.5]);
    const tLEb = verts.length; verts.push([s*1.1, -0.03, -2.4]);
    const tTEb = verts.length; verts.push([s*1.1, -0.03, -2.6]);
    faces.push({ v: [rLE, tLE, tTE, rTE], c: wCol });
    faces.push({ v: [rLEb, rTEb, tTEb, tLEb], c: [wCol[0]*0.65, wCol[1]*0.65, wCol[2]*0.65] });
    faces.push({ v: [tLE, tLEb, tTEb, tTE], c: [wCol[0]*0.8, wCol[1]*0.8, wCol[2]*0.8] });
    faces.push({ v: [rLE, rLEb, tLEb, tLE], c: [wCol[0]*0.85, wCol[1]*0.85, wCol[2]*0.85] });
  }
  addHS(-1); addHS(1);

  // Vertical stabilizer
  const vBLE = verts.length; verts.push([0, 0, -2.2]);
  const vBTE = verts.length; verts.push([0, 0, -2.5]);
  const vTLE = verts.length; verts.push([0, 0.7, -2.3]);
  const vTTE = verts.length; verts.push([0, 0.7, -2.6]);
  const vCol = [0.30, 0.37, 0.43];
  faces.push({ v: [vBLE, vTLE, vTTE, vBTE], c: vCol });
  faces.push({ v: [vBLE, vBTE, vTTE, vTLE], c: [vCol[0]*0.75, vCol[1]*0.75, vCol[2]*0.75] });

  // Cockpit canopy
  const cF = verts.length; verts.push([0, 0.15, 1.5]);
  const cB = verts.length; verts.push([0, 0.15, 0.3]);
  const cFT = verts.length; verts.push([0, 0.38, 1.3]);
  const cBT = verts.length; verts.push([0, 0.38, 0.5]);
  faces.push({ v: [cF, cFT, cBT, cB], c: [0.10, 0.20, 0.32] });
  faces.push({ v: [cF, cB, cBT, cFT], c: [0.07, 0.14, 0.24] });

  // === Transform & Project ===
  const pitchRad = state.pitch * Math.PI / 180;
  const bankRad = state.bank * Math.PI / 180;
  const camY = 1.0, camZ = -7.5;
  const focal = Math.min(W, H) * 0.75;
  const scY = H * 0.52;

  const tf = verts.map(v => {
    let x = v[0], y = v[1], z = v[2];
    const cp = Math.cos(pitchRad), sp = Math.sin(pitchRad);
    const ny = y * cp - z * sp;
    const nz = y * sp + z * cp;
    y = ny; z = nz;
    const cb = Math.cos(bankRad), sb = Math.sin(bankRad);
    const nx = x * cb - y * sb;
    const nyy = x * sb + y * cb;
    return [nx, nyy, z];
  });

  const proj = tf.map(v => {
    const vz = v[2] - camZ;
    if (vz <= 0.1) return null;
    return { x: (v[0] * focal) / vz + W / 2, y: (-(v[1] - camY) * focal) / vz + scY, z: vz };
  });

  // Light direction
  const lD = [-0.4, 0.7, 0.6];
  const lL = Math.sqrt(lD[0]**2 + lD[1]**2 + lD[2]**2);
  const lx = lD[0]/lL, ly = lD[1]/lL, lz = lD[2]/lL;

  // Build face list with depth & lighting
  const fData = faces.map(face => {
    const pts = face.v.map(vi => proj[vi]);
    if (pts.some(p => !p)) return null;
    const tv = face.v.map(vi => tf[vi]);
    const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
    const e1 = [tv[1][0]-tv[0][0], tv[1][1]-tv[0][1], tv[1][2]-tv[0][2]];
    const e2 = [tv[2][0]-tv[0][0], tv[2][1]-tv[0][1], tv[2][2]-tv[0][2]];
    let nx = e1[1]*e2[2] - e1[2]*e2[1];
    let ny = e1[2]*e2[0] - e1[0]*e2[2];
    let nz = e1[0]*e2[1] - e1[1]*e2[0];
    const nL = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
    nx /= nL; ny /= nL; nz /= nL;
    // Flip normal toward camera
    const cxA = tv.reduce((s, v) => s + v[0], 0) / tv.length;
    const cyA = tv.reduce((s, v) => s + v[1], 0) / tv.length;
    const czA = tv.reduce((s, v) => s + v[2], 0) / tv.length;
    const vDot = nx*(0-cxA) + ny*(camY-cyA) + nz*(camZ-czA);
    const sign = vDot > 0 ? 1 : -1;
    const light = Math.max(0.15, sign * (nx*lx + ny*ly + nz*lz));
    return { pts, avgZ, light, color: face.c };
  }).filter(f => f);

  // Sort back-to-front
  fData.sort((a, b) => b.avgZ - a.avgZ);

  // Draw
  fData.forEach(fd => {
    const r = Math.round(fd.color[0] * fd.light * 255);
    const g = Math.round(fd.color[1] * fd.light * 255);
    const b = Math.round(fd.color[2] * fd.light * 255);
    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.strokeStyle = 'rgba(0,255,65,0.12)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    fd.pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Wing tip nav lights
  function drawLight(vi, color) {
    const p = proj[vi];
    if (!p) return;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  drawLight(rwTips.tip, 'rgba(0,255,65,0.9)');
  drawLight(lwTips.tip, 'rgba(255,40,40,0.9)');

  // Engine exhaust glow
  const glow = state.throttle / 100;
  if (glow > 0.1) {
    [[1.0, 0, -0.5], [-1.0, 0, -0.5]].forEach(pos => {
      let x = pos[0], y = pos[1], z = pos[2];
      const cp = Math.cos(pitchRad), sp = Math.sin(pitchRad);
      const ny = y * cp - z * sp; const nz = y * sp + z * cp;
      y = ny; z = nz;
      const cb = Math.cos(bankRad), sb = Math.sin(bankRad);
      const nx = x * cb - y * sb; const nyy = x * sb + y * cb;
      const vz = z - camZ;
      if (vz <= 0.1) return;
      const sx = (nx * focal) / vz + W / 2;
      const sy = (-(y - camY) * focal) / vz + scY;
      const rad = 18 * glow;
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, rad);
      grad.addColorStop(0, 'rgba(255,200,50,' + (0.7 * glow) + ')');
      grad.addColorStop(0.4, 'rgba(255,100,20,' + (0.35 * glow) + ')');
      grad.addColorStop(1, 'rgba(255,50,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, rad, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function drawAHI() {
  const size = 120;
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  ahiCtx.clearRect(0, 0, size, size);

  ahiCtx.save();
  ahiCtx.beginPath();
  ahiCtx.arc(cx, cy, r, 0, Math.PI * 2);
  ahiCtx.clip();

  ahiCtx.translate(cx, cy);
  ahiCtx.rotate(-state.bank * Math.PI / 180);

  const pitchOffset = state.pitch * 1.2;

  // Sky
  ahiCtx.fillStyle = '#1a3060';
  ahiCtx.fillRect(-r * 2, -r * 2, r * 4, r * 2 + pitchOffset);

  // Ground
  ahiCtx.fillStyle = '#1a3a1a';
  ahiCtx.fillRect(-r * 2, pitchOffset, r * 4, r * 4);

  // Horizon line
  ahiCtx.strokeStyle = 'rgba(0,255,65,0.6)';
  ahiCtx.lineWidth = 1.5;
  ahiCtx.beginPath();
  ahiCtx.moveTo(-r * 2, pitchOffset);
  ahiCtx.lineTo(r * 2, pitchOffset);
  ahiCtx.stroke();

  // Pitch marks
  ahiCtx.strokeStyle = 'rgba(0,255,65,0.25)';
  ahiCtx.lineWidth = 0.8;
  for (let p = -30; p <= 30; p += 10) {
    if (p === 0) continue;
    const y = pitchOffset - p * 1.2;
    const hw = p % 20 === 0 ? 16 : 10;
    ahiCtx.beginPath();
    ahiCtx.moveTo(-hw, y);
    ahiCtx.lineTo(hw, y);
    ahiCtx.stroke();
  }

  ahiCtx.restore();

  // Fixed aircraft symbol
  ahiCtx.strokeStyle = '#00FF41';
  ahiCtx.lineWidth = 2;
  
  // Center dot
  ahiCtx.fillStyle = '#00FF41';
  ahiCtx.beginPath();
  ahiCtx.arc(cx, cy, 2, 0, Math.PI * 2);
  ahiCtx.fill();

  // Wings
  ahiCtx.beginPath();
  ahiCtx.moveTo(cx - 28, cy);
  ahiCtx.lineTo(cx - 10, cy);
  ahiCtx.lineTo(cx - 10, cy + 4);
  ahiCtx.stroke();

  ahiCtx.beginPath();
  ahiCtx.moveTo(cx + 28, cy);
  ahiCtx.lineTo(cx + 10, cy);
  ahiCtx.lineTo(cx + 10, cy + 4);
  ahiCtx.stroke();

  // Bank angle indicator at top
  ahiCtx.save();
  ahiCtx.translate(cx, cy);
  const bankMarks = [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60];
  bankMarks.forEach(deg => {
    const rad = (deg - 90) * Math.PI / 180;
    const inner = r - 10;
    const outer = r - 4;
    ahiCtx.strokeStyle = deg === 0 ? '#00FF41' : 'rgba(0,255,65,0.3)';
    ahiCtx.lineWidth = deg % 30 === 0 ? 2 : 1;
    ahiCtx.beginPath();
    ahiCtx.moveTo(Math.cos(rad) * inner, Math.sin(rad) * inner);
    ahiCtx.lineTo(Math.cos(rad) * outer, Math.sin(rad) * outer);
    ahiCtx.stroke();
  });

  // Current bank pointer
  const bRad = (-state.bank - 90) * Math.PI / 180;
  const pInner = r - 14;
  const pTip = r - 5;
  ahiCtx.fillStyle = '#00FF41';
  ahiCtx.beginPath();
  ahiCtx.moveTo(Math.cos(bRad) * pTip, Math.sin(bRad) * pTip);
  ahiCtx.lineTo(Math.cos(bRad - 0.08) * pInner, Math.sin(bRad - 0.08) * pInner);
  ahiCtx.lineTo(Math.cos(bRad + 0.08) * pInner, Math.sin(bRad + 0.08) * pInner);
  ahiCtx.closePath();
  ahiCtx.fill();
  ahiCtx.restore();

  // Outer ring
  ahiCtx.strokeStyle = 'rgba(0,255,65,0.2)';
  ahiCtx.lineWidth = 1;
  ahiCtx.beginPath();
  ahiCtx.arc(cx, cy, r, 0, Math.PI * 2);
  ahiCtx.stroke();
}

function drawCompass() {
  const w = 200;
  const h = 28;
  compassCtx.clearRect(0, 0, w, h);

  const hdg = state.heading;
  const degsVisible = 60;
  const pxPerDeg = w / degsVisible;

  compassCtx.fillStyle = 'rgba(0,255,65,0.03)';
  compassCtx.fillRect(0, 0, w, h);

  const cardinals = {0:'N',45:'NE',90:'E',135:'SE',180:'S',225:'SW',270:'W',315:'NW'};

  for (let d = -degsVisible; d <= degsVisible; d++) {
    let deg = Math.round(hdg + d);
    if (deg < 0) deg += 360;
    if (deg >= 360) deg -= 360;
    
    const x = w / 2 + d * pxPerDeg;
    if (x < -10 || x > w + 10) continue;

    if (deg % 10 === 0) {
      compassCtx.strokeStyle = deg % 30 === 0 ? 'rgba(0,255,65,0.5)' : 'rgba(0,255,65,0.2)';
      compassCtx.lineWidth = 1;
      compassCtx.beginPath();
      const tickH = deg % 30 === 0 ? 8 : 5;
      compassCtx.moveTo(x, h);
      compassCtx.lineTo(x, h - tickH);
      compassCtx.stroke();
    }

    if (cardinals[deg]) {
      compassCtx.fillStyle = deg === 0 || deg === 360 ? '#00FF41' : 'rgba(0,255,65,0.6)';
      compassCtx.font = '10px "JetBrains Mono", monospace';
      compassCtx.textAlign = 'center';
      compassCtx.fillText(cardinals[deg], x, 12);
    } else if (deg % 30 === 0) {
      compassCtx.fillStyle = 'rgba(0,255,65,0.35)';
      compassCtx.font = '8px "JetBrains Mono", monospace';
      compassCtx.textAlign = 'center';
      compassCtx.fillText(deg.toString(), x, 11);
    }
  }

  // Center marker
  compassCtx.fillStyle = '#00FF41';
  compassCtx.beginPath();
  compassCtx.moveTo(w / 2, h);
  compassCtx.lineTo(w / 2 - 4, h - 4);
  compassCtx.lineTo(w / 2 + 4, h - 4);
  compassCtx.closePath();
  compassCtx.fill();
}

function drawAltTape() {
  const tapeW = 52;
  const tapeH = 180;
  const x = W - 80;
  const y = H / 2 - tapeH / 2;

  ctx.fillStyle = 'rgba(0,255,65,0.03)';
  ctx.strokeStyle = 'rgba(0,255,65,0.2)';
  ctx.lineWidth = 1;
  ctx.fillRect(x, y, tapeW, tapeH);
  ctx.strokeRect(x, y, tapeW, tapeH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, tapeW, tapeH);
  ctx.clip();

  const alt = state.altitude;
  const pxPerFt = 0.4;
  const midY = y + tapeH / 2;

  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';

  for (let ft = Math.floor(alt / 100) * 100 - 500; ft <= alt + 500; ft += 100) {
    if (ft < 0) continue;
    const dy = (alt - ft) * pxPerFt;
    const ty = midY + dy;
    
    if (ty < y - 10 || ty > y + tapeH + 10) continue;

    ctx.strokeStyle = 'rgba(0,255,65,0.2)';
    ctx.beginPath();
    ctx.moveTo(x, ty);
    ctx.lineTo(x + 6, ty);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0,255,65,0.5)';
    ctx.fillText(ft.toString(), x + tapeW - 6, ty + 3);
  }
  ctx.restore();

  // Current value box
  ctx.fillStyle = 'rgba(0,10,0,0.8)';
  ctx.fillRect(x - 2, midY - 10, tapeW + 4, 20);
  ctx.strokeStyle = '#00FF41';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 2, midY - 10, tapeW + 4, 20);
  ctx.fillStyle = '#00FF41';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(Math.round(alt).toString(), x + tapeW / 2, midY + 4);

  // Label
  ctx.fillStyle = 'rgba(0,255,65,0.3)';
  ctx.font = '8px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ALT', x + tapeW / 2, y - 6);
}

function drawSpdTape() {
  const tapeW = 52;
  const tapeH = 180;
  const x = 28;
  const y = H / 2 - tapeH / 2;

  ctx.fillStyle = 'rgba(0,255,65,0.03)';
  ctx.strokeStyle = 'rgba(0,255,65,0.2)';
  ctx.lineWidth = 1;
  ctx.fillRect(x, y, tapeW, tapeH);
  ctx.strokeRect(x, y, tapeW, tapeH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, tapeW, tapeH);
  ctx.clip();

  const spd = state.speed;
  const pxPerKt = 1.5;
  const midY = y + tapeH / 2;

  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';

  for (let kt = Math.floor(spd / 10) * 10 - 80; kt <= spd + 80; kt += 10) {
    if (kt < 0) continue;
    const dy = (spd - kt) * pxPerKt;
    const ty = midY + dy;
    
    if (ty < y - 10 || ty > y + tapeH + 10) continue;

    const isStall = kt < STALL_SPEED;
    ctx.strokeStyle = isStall ? 'rgba(255,40,40,0.3)' : 'rgba(0,255,65,0.2)';
    ctx.beginPath();
    ctx.moveTo(x + tapeW - 6, ty);
    ctx.lineTo(x + tapeW, ty);
    ctx.stroke();

    ctx.fillStyle = isStall ? 'rgba(255,40,40,0.5)' : 'rgba(0,255,65,0.5)';
    ctx.fillText(kt.toString(), x + 6, ty + 3);
  }
  ctx.restore();

  // Current value box
  ctx.fillStyle = 'rgba(0,10,0,0.8)';
  ctx.fillRect(x - 2, midY - 10, tapeW + 4, 20);
  ctx.strokeStyle = spd < STALL_SPEED ? '#ff2020' : '#00FF41';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 2, midY - 10, tapeW + 4, 20);
  ctx.fillStyle = spd < STALL_SPEED ? '#ff2020' : '#00FF41';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(Math.round(spd).toString(), x + tapeW / 2, midY + 4);

  // Label
  ctx.fillStyle = 'rgba(0,255,65,0.3)';
  ctx.font = '8px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('KTS', x + tapeW / 2, y - 6);
}

function render() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, W, H);

  const bankRad = state.bank * Math.PI / 180;
  const pitchPx = state.pitch * 4;
  const horizonY = H / 2 + pitchPx;

  drawSky(horizonY, bankRad);
  drawGround(horizonY, bankRad);
  drawGrid(horizonY, bankRad);
  drawHorizonLine(horizonY, bankRad);
  
  if (cameraMode === 0) {
    drawPitchLadder(bankRad);
    drawCrosshair();
  } else {
    drawAirplane();
  }
  
  drawAltTape();
  drawSpdTape();
  drawAHI();
  drawCompass();
  
  document.getElementById('cam-label').textContent = cameraMode === 0 ? 'COCKPIT' : 'CHASE';

  // Update HUD
  hudAlt.textContent = Math.round(state.altitude);
  hudSpd.textContent = Math.round(state.speed);
  const hdgDisplay = Math.round(state.heading) % 360;
  hudHdg.textContent = hdgDisplay === 0 ? '360' : hdgDisplay.toString().padStart(3, '0');
  const vsSign = state.vs >= 0 ? '+' : '';
  hudVs.textContent = vsSign + Math.round(state.vs);
  hudThr.textContent = Math.round(state.throttle) + '%';

  // Throttle bar
  thrFill.style.height = state.throttle + '%';

  // Stall warning
  stallWarn.style.display = state.speed < STALL_SPEED && !state.terrainHit ? 'block' : 'none';

  // Color VS based on positive/negative
  hudVs.style.color = state.vs < -200 ? '#ff4444' : state.vs > 200 ? '#44ff44' : '#00FF41';
}

function loop() {
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  update(dt);
  render();
  requestAnimationFrame(loop);
}

loop();
})();
<\/script>
</body>
</html>`;

    iframe.srcdoc = htmlContent;
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh", background: "#0a0a0f" }} />;
}