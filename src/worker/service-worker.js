import '@babel/polyfill'
import database from '../manager/database'
import Configurator from '../manager/configuration'
import Proxy from '../manager/providers'
import { getNotification } from '../notification/balance-notifier'
import { getNotification as getBackgroundNotification } from '../notification/background-notifier'
import { sendNotification } from '../notification/notify'
import { syncBalances } from '../manager/balance-manager'

const PRECACHE = 'precache-' + process.env.APP_VERSION
const RUNTIME = 'runtime'

const PRECACHE_URLS = [
  'index.html',
  './',
  'main.bundle.js'
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

self.addEventListener('push', async () => {
  const clients = await self.clients.matchAll()
  let sentNotification = false
  let wallets = []

  try {
    wallets = await Configurator.getWallets()
  } catch (e) {
    return clients.forEach(client => {
      client.postMessage({ // Todo: error handling in notifications store
        error: {_level: 'ERROR', _date: new Date(), _title: e.message, _content: e.stack}
      })
    })
  }

  for (const walletKey in wallets) {
    let diffs = []
    let error = false
    const wallet = wallets[walletKey]

    try {
      diffs = await syncBalances(wallet)

      for (const diffKey in diffs) {
        const diff = diffs[diffKey]
        if (diff.amount === 0) {
          continue
        }

        const notification = getNotification(diff)
        sendNotification(notification, self.registration)
        sentNotification = true
      }
    } catch (e) {
      error = { _level: 'ERROR', _date: new Date(), _walletId: wallet.id, _title: e.message, _content: e.stack }
    }

    clients.forEach(client => {
      client.postMessage({
        walletId: wallet.id,
        balanceIds: diffs.map(diff => diff.balance.id),
        error: error
      })
    })
  }

  if (!sentNotification) {
    sendNotification(getBackgroundNotification(), self.registration)
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow('/')
  )
})

self.addEventListener('message', async event => {
  const { action } = event.data
  const clients = await self.clients.matchAll()

  switch (action) {
    case 'balance-refresh':
      const { walletId, currencies } = event.data

      let error = false
      let balances = []
      try {
        const wallet = await Configurator.getWallet(walletId)
        balances = await new Proxy(wallet).getBalances(currencies)

        await database.storeBalances(balances)
      } catch (e) {
        error = { _level: 'ERROR', _date: new Date(), _walletId: walletId, _title: e.message, _content: e.stack }
      }

      clients.forEach(client => {
        client.postMessage({
          action: action,
          walletId: walletId,
          balanceIds: balances.map(balance => balance.id),
          error: error
        })
      })

      break
    case 'app-upgrade':
      caches.keys().then((names) => {
        for (let name of names) {
          caches.delete(name)
        }
      })

      clients.forEach(client => {
        client.postMessage({
          action: action
        })
      })
  }
})
