// service-worker.ts
const CACHE_NAME = "pixi-assets-v1";
const MAX_AGE_DAYS = 7;
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

// helper per memorizzare metadata (timestamp) nel IndexedDB o cache metadata semplice
const metadataCache: Record<string, number> = {};

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event: FetchEvent) => {
    const url = new URL(event.request.url);

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(event.request);
            const now = Date.now();

            // Se è in cache e non scaduto → servilo
            if (cachedResponse && metadataCache[url.href]) {
                const age = now - metadataCache[url.href];
                if (age < MAX_AGE_MS) {
                    metadataCache[url.href] = now; // reset timer (rinnovo)
                    return cachedResponse;
                } else {
                    // Scaduto → rimuovi
                    await cache.delete(event.request);
                    delete metadataCache[url.href];
                }
            }

            // Altrimenti scarica e cachea
            try {
                const networkResponse = await fetch(event.request, { mode: "cors" });
                if (networkResponse.ok) {
                    cache.put(event.request, networkResponse.clone());
                    metadataCache[url.href] = now;
                }
                return networkResponse;
            } catch (err) {
                // fallback: se c'è cache vecchia, la uso comunque
                if (cachedResponse) return cachedResponse;
                throw err;
            }
        })
    );
});
