const { app, BrowserWindow } = require('electron');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

// Load .env from project root (not committed to git)
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, v] = line.split('=');
    if (k && v && !process.env[k.trim()]) process.env[k.trim()] = v.trim();
  });
}

const GA_MEASUREMENT_ID = 'G-9025XV85CH';
const GA_API_SECRET = process.env.GA_API_SECRET || '';

function sendGAEvent(clientId, eventName, params = {}) {
  if (!GA_API_SECRET) return;
  const body = JSON.stringify({
    client_id: clientId,
    events: [{ name: eventName, params: { platform: 'desktop', ...params } }],
  });
  const req = https.request({
    hostname: 'www.google-analytics.com',
    path: `/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  });
  req.on('error', () => {});
  req.write(body);
  req.end();
}

function createWindow() {
  // Stable client ID per installation (stored in userData)
  const clientIdPath = path.join(app.getPath('userData'), 'ga-client-id.txt');
  let clientId;
  try { clientId = require('fs').readFileSync(clientIdPath, 'utf8').trim(); } catch {}
  if (!clientId) {
    clientId = crypto.randomUUID();
    try { require('fs').writeFileSync(clientIdPath, clientId); } catch {}
  }

  sendGAEvent(clientId, 'session_start', { page_title: 'Flight Simulator Desktop', engagement_time_msec: 1 });
  sendGAEvent(clientId, 'page_view', { page_title: 'Flight Simulator Desktop', page_location: 'https://giamat13.github.io/flight-sim/desktop', engagement_time_msec: 1 });

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Flight Simulator',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, '../public/simulator.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
