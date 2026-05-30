const CACHE_NAME = "afzan-pwa-cache-v3";

const PRECACHE_ASSETS = ["/", "/dashboard", "/manifest.json", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        console.log("Membuka cache dan mendownload aset...");

        const dls = PRECACHE_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok)
              throw new Error(`Request gagal untuk URL: ${url}`);
            return await cache.put(url, response);
          } catch (err) {
            console.warn(`Gagal mem-precache: ${url}. Error:`, err);
          }
        });

        await Promise.allSettled(dls);
        console.log("Fase Precache selesai.");
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("Menghapus Cache Lama:", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            if (event.request.mode === "navigate") {
              return cache.match("/dashboard") || cache.match("/");
            }
          });

        return cachedResponse || fetchPromise;
      });
    }),
  );
});
