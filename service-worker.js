// 🚀 SERVICE WORKER FOR BACKPACK OPTIMIZER
const CACHE_NAME = 'backpack-optimizer-v1.0.1';
const STATIC_ASSETS = [
    '/',
    '/dashboard.html',
    '/dashboard.css',
    '/dashboard.js',
    '/pwa-install.js',
    '/manifest.json'
];

console.log('🔧 Service Worker starting...');

// Install event
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker installed!');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker install failed:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated!');
            return self.clients.claim();
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('/dashboard.html');
                }
            })
    );
});
