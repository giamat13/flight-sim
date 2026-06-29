// Service Worker — caches terrain tiles (Esri imagery + AWS elevation) for offline flight.
const CACHE = 'flight-sim-tiles-v1';
const TILE_HOSTS = ['services.arcgisonline.com', 's3.amazonaws.com'];

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
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        }).catch(() => cached || Response.error());
      })
    )
  );
});

// Pre-cache a list of URLs sent from the main page.
self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'PRECACHE') return;
  const urls = event.data.urls || [];
  caches.open(CACHE).then(cache => {
    let done = 0;
    const total = urls.length;
    const tick = () => {
      done++;
      event.source && event.source.postMessage({ type: 'PRECACHE_PROGRESS', done, total });
    };
    Promise.all(urls.map(url =>
      cache.match(url).then(hit => {
        if (hit) { tick(); return; }
        return fetch(url, { mode: 'cors' }).then(r => {
          if (r.ok) cache.put(url, r);
          tick();
        }).catch(() => tick());
      })
    )).then(() => {
      event.source && event.source.postMessage({ type: 'PRECACHE_DONE', total });
    });
  });
});

// Purge tile cache on demand.
self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'CLEAR_CACHE') return;
  caches.delete(CACHE).then(() => {
    event.source && event.source.postMessage({ type: 'CACHE_CLEARED' });
  });
});
