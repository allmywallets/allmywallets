export const getCapabilities = () => {
  return {
    'service-worker': {
      available: 'serviceWorker' in navigator,
      name: 'Service workers (offline mode, background sync, push notifications)'
    },
    'notification': {
      available: 'Notification' in window,
      name: 'Notifications'
    },
    'indexed-db': {
      available: 'indexedDB' in window,
      name: 'Local database (IndexedDB)'
    }
  }
}

export const missingCapabilities = () => {
  const capabilities = getCapabilities()
  let missing = false

  Object.keys(capabilities).forEach(key => {
    if (!capabilities[key].available) {
      missing = true
    }
  })

  return missing
}
