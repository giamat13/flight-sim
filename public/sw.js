// Service Worker — caches terrain tiles (Esri imagery + AWS elevation) for offline flight.
const CACHE = 'flight-sim-tiles-v1';
const TILE_HOSTS = ['services.arcgisonline.com', 's3.amazonaws.com'];

// Take over immediately so updated SW logic (e.g. abort/timeout fixes) applies without a reload.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

function isTileRequest(url) {
  try {
    const h = new URL(url).hostname;
    return TILE_HOSTS.some(t => h.endsWith(t));
  } catch { return false; }
}

self.addEventListener('fetch', event => {
  if (!isTileRequest(event.request.url)) return;
  event.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) cache.put(event.request, response.clone()).catch(() => {});
          return response;
        }).catch(() => Response.error());
      })
    )
  );
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

    caches.open(CACHE).then(async cache => {
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
    caches.delete(CACHE).then(() => {
      event.source && event.source.postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});
