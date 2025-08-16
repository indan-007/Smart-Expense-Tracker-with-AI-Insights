const CACHE_NAME = 'expense-tracker-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/js/main.js',
    '/js/store.js',
    '/js/csv.js',
    '/js/charts.js',
    '/js/aiAdapter.js',
    '/js/filters.js',
    '/js/ui.js',
    '/manifest.webmanifest',
    '/data/sample.csv'
];

// Install the service worker and cache the static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching static assets');
                return cache.addAll(urlsToCache);
            })
    );
});

// Clean up old caches when a new service worker is activated
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Not in cache - fetch from network
                return fetch(event.request);
            }
            )
    );
});
