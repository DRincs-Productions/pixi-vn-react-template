const CACHE_NAME = "external-assets-v1";
const MAX_AGE_DAYS = 7;
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

const lastUsed = {};

// The fetch event handler below implements a simple cache-for-host strategy:
// - It only attempts to cache responses for requests whose hostname is explicitly allowed in the switch below.
// - Cached entries are kept in the "external-assets-v1" cache and tracked via `lastUsed` timestamps.
// - If a cached response exists and is not older than MAX_AGE_DAYS, it is served directly.
// - Otherwise the service worker fetches from the network, caches the successful response, and returns it.
// - If the network fails and a cached response exists, the cached response is returned as a fallback.
// NOTE: Add the hostnames of external asset providers you want to cache (CDNs, raw asset hosts, etc.) in the switch below.
self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    switch (url.hostname) {
        case "raw.githubusercontent.com":
            break;
        // Add asset hostnames here to enable caching for them.
        // Examples:
        // case "raw.githubusercontent.com":
        // case "cdn.jsdelivr.net":
        // case "your.cdn.domain.com":
        //     break;
        default:
            return;
    }

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const now = Date.now();
            const cached = await cache.match(request);

            if (cached && lastUsed[url.href]) {
                const age = now - lastUsed[url.href];
                if (age < MAX_AGE_MS) {
                    lastUsed[url.href] = now;
                    return cached;
                }
                await cache.delete(request);
                delete lastUsed[url.href];
            }

            try {
                const response = await fetch(request);
                if (response && response.type === "cors" && response.status < 400) {
                    await cache.put(request, response.clone());
                    lastUsed[url.href] = now;
                }
                return response;
            } catch (err) {
                if (cached) return cached;
                return fetch(request);
            }
        })()
    );
});
