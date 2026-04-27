// Faith Companion AI — Service Worker
// Strategy:
//   - Static assets (JS/CSS/images/fonts): cache-first, 30-day TTL
//   - HTML pages: network-first, fall back to cache, then /offline.html
//   - /api/* routes: network-only (never cache)

const CACHE_VERSION = 'v3';
const STATIC_CACHE  = `faithai-static-${CACHE_VERSION}`;
const PAGE_CACHE    = `faithai-pages-${CACHE_VERSION}`;

const PRECACHE_PAGES = [
  '/',
  '/tools/verse',
  '/tools/prayer',
  '/tools/devotional',
  '/tools/bible-search',
  '/tools/share-card',
  '/pricing',
  '/biblequiz',
  '/offline.html',
];

// ── Install ───────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) =>
      cache.addAll(PRECACHE_PAGES).catch(() => {
        // Individual page failures should not block the SW install.
        // Fetch each individually so one 404 doesn't kill the whole list.
        return Promise.allSettled(
          PRECACHE_PAGES.map((url) => cache.add(url).catch(() => null))
        );
      })
    ).then(() => self.skipWaiting())
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== PAGE_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests (Stripe and all external domains pass through)
  if (url.origin !== location.origin) return;

  // Never cache API routes, Next.js internals, auth paths, or payment-related pages
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/saved') ||
    url.pathname.startsWith('/checkout') ||
    url.pathname.startsWith('/en/login') ||
    url.pathname.startsWith('/es/login')
  ) {
    return; // let the browser handle it normally
  }

  // Static assets — cache-first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.pathname.startsWith('/brand/') ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|woff|woff2|ico)$/)
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // HTML navigation — network-first, fall back to cache, then offline page
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match('/offline.html');
          return offline || new Response('You are offline.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }
});
