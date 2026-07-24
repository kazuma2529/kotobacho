/**
 * kotobacho service worker
 *
 * Goals:
 * - Never trap users on a stale index.html / missing hashed JS after deploy
 * - Wipe legacy cache-first caches (kotobacho-v1 and anything else)
 * - HTML / navigations: network-first (always prefer fresh app shell)
 * - Hashed /assets/*: cache-first (safe because filenames change every build)
 * - Never cache this sw.js file itself
 */

const CACHE_NAME = 'kotobacho-v3-assets';

self.addEventListener('install', (event) => {
  // Activate immediately so broken clients pick up this SW ASAP.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      // Delete EVERY cache, including older kotobacho-v1 / v2 shells.
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.clients.claim();

      // Force open tabs onto the fresh shell (works even with old index.html).
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      await Promise.all(
        clients.map((client) => {
          if ('navigate' in client) {
            return client.navigate(client.url);
          }
          client.postMessage({ type: 'KOTOBACHO_SW_ACTIVATED' });
          return undefined;
        })
      );
    })()
  );
});

function isNavigationRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept')?.includes('text/html'))
  );
}

function isHashedAsset(url) {
  return url.origin === self.location.origin && url.pathname.startsWith('/assets/');
}

function shouldBypass(url) {
  // Never intercept SW updates or Firebase / third-party APIs.
  if (url.pathname === '/sw.js') return true;
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    return true;
  }
  return false;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Let the browser talk to the network directly (SW update + Firebase).
  if (shouldBypass(url)) {
    return;
  }

  // App shell: network-first, do not keep a long-lived HTML cache.
  if (isNavigationRequest(request) || url.pathname === '/index.html') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request, { cache: 'no-store' });
          return networkResponse;
        } catch {
          // Offline fallback only — prefer a previously fetched document if any.
          const cached = await caches.match('/index.html');
          if (cached) return cached;
          const cachedRoot = await caches.match('/');
          if (cachedRoot) return cachedRoot;
          return new Response('オフラインです。接続を確認してください。', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }
      })()
    );
    return;
  }

  // Fingerprinted build assets: cache-first is safe (new hash = new URL).
  if (isHashedAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        const networkResponse = await fetch(request);
        // Only cache real JS/CSS — never HTML fallbacks from SPA rewrites.
        const contentType = networkResponse.headers.get('content-type') || '';
        const isAsset =
          networkResponse.ok &&
          (contentType.includes('javascript') ||
            contentType.includes('css') ||
            contentType.includes('font') ||
            contentType.includes('image') ||
            contentType.includes('woff'));

        if (isAsset) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })()
    );
    return;
  }

  // Everything else (icons, manifest, etc.): network-first, no stale HTML poison.
  event.respondWith(
    (async () => {
      try {
        return await fetch(request);
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw new Error('Network error');
      }
    })()
  );
});
