import 'babel-polyfill'
import database from './database'
import Configurator from './configurator'
import Proxy from './providers'

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
  const clients = await self.clients.matchAll()

  const { walletId, currencies } = event.data

  let error = false
  let balances = []
  try {
    const wallet = await Configurator.getWallet(walletId)
    balances = await new Proxy(wallet.network, wallet.provider, wallet.parameters).getWalletData(currencies)
    balances.forEach(balance => { balance.walletId = walletId })

    await database.storeBalances(balances)
  } catch (e) {
    error = { _level: 'ERROR', _date: new Date(), _walletId: walletId, _title: e.message, _content: e.stack }
  }

  clients.forEach(client => {
    client.postMessage({
      walletId: walletId,
      balanceIds: balances.map(balance => balance.id),
      error: error
    })
  })
})
