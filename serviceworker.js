// Definición de variables
const CACHE_NAME = 'pce-ut-cache-v3';
const API_CACHE_NAME = 'pce-ut-api-cache-v1';
const OFFLINE_URL = 'offline.html';

// Archivos estáticos a precachear (rutas relativas a la raíz)
var urlsToCache = [
    'index.html',
    'login.html',
    'registro.html',
    'css/styles.css',
    'css/login.css',
    'css/registro.css',
    'js/app.js',
    'js/manifest.json',
    'img/Logo2.png',
    OFFLINE_URL
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return Promise.allSettled(
                    urlsToCache.map(url => cache.add(url).catch(() => null))
                );
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension')) {
        return;
    }

    const requestUrl = new URL(event.request.url);

    if (requestUrl.pathname.startsWith('/api/') || requestUrl.pathname.includes('/valores')) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    event.respondWith((async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        try {
            const networkResponse = await fetch(event.request);
            return networkResponse;
        } catch (error) {
            if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_URL);
            }
            return new Response(null, { status: 503, statusText: 'Service Unavailable' });
        }
    })());
});

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(API_CACHE_NAME);
        await cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const apiCache = await caches.open(API_CACHE_NAME);
        const cachedResponse = await apiCache.match(request);
        if (cachedResponse) return cachedResponse;
        return new Response(JSON.stringify({ error: 'Sin conexión y sin datos en caché' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


