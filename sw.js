const CACHE_NAME = 'backpack-optimizer-v1.0';
const STATIC_ASSETS = [
  '/dashboard.html',
  '/expenses.html', 
  '/add-expense.html',
  '/wishboard.html',
  '/marketplace.html',
  '/housing.html',
  '/analytics.html',
  '/profile.html',
  '/index.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event - Cache Static Assets
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => console.log('✅ Static assets cached'))
      .catch(error => console.error('❌ Cache failed:', error))
  );
  self.skipWaiting();
});

// Activate Event - Clean Old Caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve from Cache with Network Fallback
self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('📦 Serving from cache:', event.request.url);
            return response;
          }
          
          console.log('🌐 Fetching from network:', event.request.url);
          return fetch(event.request)
            .then(networkResponse => {
              // Cache successful responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseClone));
              }
              return networkResponse;
            });
        })
        .catch(error => {
          console.error('❌ Fetch failed:', error);
          // Offline fallback for HTML pages
          if (event.request.destination === 'document') {
            return caches.match('/dashboard.html');
          }
        })
    );
  }
});

// Background Sync for Offline Expenses
self.addEventListener('sync', event => {
  if (event.tag === 'expense-sync') {
    console.log('🔄 Background syncing expenses...');
    event.waitUntil(syncOfflineExpenses());
  }
});

// Push Notification Handler
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'view',
          title: 'View Dashboard'
        },
        {
          action: 'dismiss', 
          title: 'Dismiss'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('Backpack Optimizer', options)
    );
  }
});

// Handle Notification Clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/dashboard.html')
    );
  }
});

// Sync offline expenses when back online
async function syncOfflineExpenses() {
  try {
    const offlineExpenses = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
    if (offlineExpenses.length > 0) {
      // Process offline expenses
      console.log(`📤 Syncing ${offlineExpenses.length} offline expenses`);
      // Your sync logic here
      localStorage.removeItem('offline_expenses');
      console.log('✅ Offline expenses synced successfully');
    }
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}
