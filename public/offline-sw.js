self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open('webgl')
            .then((cache) =>
                cache.addAll([
                    '/',
                    '/index.html',
                    '/app.js',
                    '/assets/helmet.obj'
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
        fetch(event.request)
            .catch(() => caches.match(event.request))
    )
);