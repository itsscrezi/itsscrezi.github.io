const CACHE_NAME = 'crezi-site-v11';
const CORE_FILES = [
  './',
  './index.html',
  './offline.html',
  './404.html',
  './styles.css',
  './site-refresh.css',
  './ui-fixes.css',
  './content.js',
  './script.js'
];
const CACHEABLE_IMAGE_HOSTS = ['raw.githubusercontent.com'];

self.addEventListener('install', (event) => {
  // Add files one by one so a single missing file can't break the whole install.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(CORE_FILES.map((file) => cache.add(new Request(file, { cache: 'reload' })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('crezi-site-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function offlineFallback() {
  return (await caches.match('./offline.html'))
    || new Response('<!doctype html><meta charset="utf-8"><title>Offline</title><body style="font-family:sans-serif;background:#0b0b0b;color:#fff;padding:40px"><h1>No connection.</h1><p>Check your connection and try again.</p>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// Pages, CSS and JS: always try the network first (so updates show up), fall back to the cache.
async function networkFirst(event) {
  const request = event.request;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {}));
    }
    return response; // includes GitHub's own 404 page for missing URLs
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: request.mode === 'navigate' });
    if (cached) return cached;
    if (request.mode === 'navigate') return offlineFallback();
    return Response.error();
  }
}

// Images: show the cached copy instantly, refresh it in the background.
async function imageStrategy(event) {
  const request = event.request;
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone()).catch(() => {});
      return response;
    })
    .catch(() => null);
  if (cached) { event.waitUntil(network); return cached; }
  return (await network) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isImage = request.destination === 'image';
  if (!sameOrigin && !(isImage && CACHEABLE_IMAGE_HOSTS.includes(url.hostname))) return;
  event.respondWith(isImage ? imageStrategy(event) : networkFirst(event));
});
