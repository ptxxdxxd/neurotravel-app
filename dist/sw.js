// Service Worker for NeuroTravel
// Provides offline functionality and caching for better performance

const CACHE_NAME = 'neurotravel-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/neurotravel_logo_main.png',
  '/neurotravel_icon.png',
  // Add more critical assets here
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical resources');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    handleFetch(event.request)
  );
});

async function handleFetch(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200 && response.type === 'basic') {
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    
    return response;
  } catch (error) {
    console.log('Network request failed, trying cache:', request.url);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For navigation requests, serve offline page
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match(OFFLINE_URL);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Fallback to network error
    throw error;
  }
}

// Background sync for sending queued data when connection returns
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
  
  if (event.tag === 'error-sync') {
    event.waitUntil(syncErrors());
  }
});

async function syncAnalytics() {
  try {
    // Get queued analytics data from IndexedDB
    const queuedEvents = await getQueuedAnalytics();
    
    if (queuedEvents.length > 0) {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: queuedEvents })
      });
      
      if (response.ok) {
        await clearQueuedAnalytics();
        console.log('Synced queued analytics events');
      }
    }
  } catch (error) {
    console.error('Analytics sync failed:', error);
  }
}

async function syncErrors() {
  try {
    // Get queued error reports from IndexedDB
    const queuedErrors = await getQueuedErrors();
    
    if (queuedErrors.length > 0) {
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors: queuedErrors })
      });
      
      if (response.ok) {
        await clearQueuedErrors();
        console.log('Synced queued error reports');
      }
    }
  } catch (error) {
    console.error('Error sync failed:', error);
  }
}

// IndexedDB helpers (simplified)
async function getQueuedAnalytics() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function clearQueuedAnalytics() {
  // In a real implementation, this would clear IndexedDB
}

async function getQueuedErrors() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function clearQueuedErrors() {
  // In a real implementation, this would clear IndexedDB
}

// Push notification handling (for crisis alerts)
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: 'NeuroTravel crisis support is available',
    icon: '/neurotravel_icon.png',
    badge: '/neurotravel_icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open NeuroTravel',
        icon: '/neurotravel_icon.png'
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/neurotravel_icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('NeuroTravel Support', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});