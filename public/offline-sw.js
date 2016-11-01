self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open('webgl')
            .then((cache) =>
                cache.addAll([
                    '/',
                    '/index.html',
                    '/app.js'
                ])
            )
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) =>
    event.waitUntil(self.clients.claim())
);

self.addEventListener('fetch', (event) =>
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => response || fetch(event.request))
    )
);