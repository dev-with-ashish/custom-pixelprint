// service-worker.js

// Define a cache name and the assets to cache
const CACHE_NAME = 'shopify-cache-v1';
const urlsToCache = [
  '/', // Cache the homepage (optional)
  '/assets/your-image.jpg' // Update the path to match your actual image asset
];

// Install event: Open the cache and add the defined assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Serve assets from the cache when available, otherwise fetch from the network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
