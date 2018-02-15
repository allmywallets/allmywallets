import BrowserNotification from '../model/BrowserNotification'

export const getNotification = () => {
  return new BrowserNotification(
    'Your balances have been synced',
    {
      body: 'Balances have been synced in the background.',
      silent: true,
      noscreen: true,
      requireInteraction: false,
      tag: 'background'
    }
  )
}
