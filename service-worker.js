const cacheName = "cache";

self.addEventListener("install", event => {
  // Activate the new service worker immediately
  self.skipWaiting();

  // Add the initial resources to the cache
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css"
      ]);
    })
  );
});

self.addEventListener("activate", event => {
  // Delete any non-current cache
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Offline-first, cache-first strategy
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If the resource is in the cache, return it
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch the resource from the network
      return fetch(event.request).then(networkResponse => {
        // Add the resource to the cache for future use
        if (networkResponse.ok) {
          caches.open(cacheName).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }

        return networkResponse;
      });
    })
  );
});
