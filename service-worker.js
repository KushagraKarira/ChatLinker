const CACHE_NAME = 'my-cache';

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If the response is valid, cache it for later use
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              // Set the cache-control header to cache the response for 68 years !!
              const headers = new Headers(response.headers);
              headers.set('cache-control', 'max-age=2147483647');
              const responseWithHeaders = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers,
              });
              cache.put(event.request, responseWithHeaders);
            });
        }

        return response;
      })
      .catch(() => {
        // If the network request fails, try to retrieve the resource from the cache
        return caches.match(event.request);
      })
  );
});

