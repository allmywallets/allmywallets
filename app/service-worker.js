import synchronizer from './synchronizer'

const PRECACHE = 'precache-' + process.env.VERSION
const RUNTIME = 'runtime'

const PRECACHE_URLS = [
  'index.html',
  './',
  'main.js'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
    )
})

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME]
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete)
      }))
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse
        }
        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response
            })
          })
        })
      })
    )
  }
})

self.addEventListener('message', async event => {
  const action = event.data.action

  if (action !== 'sync') {
    return
  }

  const walletId = event.data.id

  let success = true
  try {
    await event.waitUntil(synchronizer.sync(walletId))
  } catch (e) {
    success = false
  }

  const clients = await self.clients.matchAll()

  clients.forEach(client => {
    client.postMessage({
      action: action,
      id: walletId,
      success: success
    })
  })
})
