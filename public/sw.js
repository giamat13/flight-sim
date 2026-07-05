// Service Worker — offline support for the flight sim.
//   • flight-sim-tiles-v1 : terrain tiles (Esri imagery + AWS elevation), cache-first.
//   • flight-sim-app-v1   : the app shell itself (HTML/JS) + the CDN modules it needs
//                           (Three.js) + country flags, so the whole SITE opens offline.
const TILE_CACHE = 'flight-sim-tiles-v1';
const APP_CACHE  = 'flight-sim-app-v1';
const TILE_HOSTS = ['services.arcgisonline.com', 's3.amazonaws.com'];
// Cross-origin hosts whose successful responses we runtime-cache so the app can boot
// and render fully OFFLINE (Three.js ES modules, country flag PNGs).
const RUNTIME_HOSTS = ['unpkg.com', 'flagcdn.com'];

// Take over immediately so updated SW logic applies without a manual reload.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

function hostMatches(url, list) {
  try { const h = new URL(url).hostname; return list.some(t => h === t || h.endsWith('.' + t) || h.endsWith(t)); }
  catch { return false; }
}
function isTileRequest(url) { return hostMatches(url, TILE_HOSTS); }
function isRuntimeHost(url) { return hostMatches(url, RUNTIME_HOSTS); }

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  // 1) Terrain tiles — cache-first in the dedicated tile cache (unchanged behaviour).
  if (isTileRequest(url)) {
    event.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(req).then(cached => {
          if (cached) return cached;
          return fetch(req).then(response => {
            if (response.ok) cache.put(req, response.clone()).catch(() => {});
            return response;
          }).catch(() => Response.error());
        })
      )
    );
    return;
  }

  // 2) App shell (same-origin) + whitelisted CDN assets — network-first (so updates
  //    land while online) with a cache fallback so the whole site opens OFFLINE.
  let sameOrigin = false;
  try { sameOrigin = new URL(url).origin === self.location.origin; } catch {}
  if (sameOrigin || isRuntimeHost(url)) {
    event.respondWith(
      caches.open(APP_CACHE).then(cache =>
        fetch(req).then(response => {
          if (response && response.ok) cache.put(req, response.clone()).catch(() => {});
          return response;
        }).catch(() =>
          cache.match(req).then(hit => {
            if (hit) return hit;
            // Offline navigation with no exact match → fall back to a cached app entry.
            if (req.mode === 'navigate')
              return cache.match('./').then(r => r || cache.match('index.html').then(r2 => r2 || cache.match('simulator.html'))).then(r3 => r3 || Response.error());
            return Response.error();
          })
        )
      )
    );
    return;
  }
  // Everything else (Firebase, Nominatim, weather, traffic APIs) → straight to network.
});

// Fetch one tile with hard abort; resolves null on any error/timeout so we never hang.
async function fetchWithTimeout(url, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { mode: 'cors', signal: ctrl.signal });
    clearTimeout(timer);
    return r.ok ? r : null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// Pre-cache URLs in batches to avoid flooding the network and getting stuck.
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'PRECACHE') {
    const urls = event.data.urls || [];
    const total = urls.length;
    let done = 0;
    const BATCH = 16;      // concurrent fetches per batch
    const TILE_TIMEOUT = 8000;  // ms per tile before aborting and moving on

    caches.open(TILE_CACHE).then(async cache => {
      for (let i = 0; i < urls.length; i += BATCH) {
        const batch = urls.slice(i, i + BATCH);
        await Promise.all(batch.map(async url => {
          const hit = await cache.match(url);
          if (!hit) {
            const r = await fetchWithTimeout(url, TILE_TIMEOUT);
            if (r) await cache.put(url, r).catch(() => {});
          }
          done++;
          event.source && event.source.postMessage({ type: 'PRECACHE_PROGRESS', done, total });
        }));
      }
      event.source && event.source.postMessage({ type: 'PRECACHE_DONE', total: done });
    });
  }

  if (event.data.type === 'CLEAR_CACHE') {
    caches.delete(TILE_CACHE).then(() => {
      event.source && event.source.postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});
