export default class NotificationNotifier {
  constructor (registration) {
    this._registration = registration
  }

  static shouldNotify (oldBalance, newBalance) {
    return oldBalance !== undefined && newBalance !== undefined && oldBalance.amount !== newBalance.amount
  }

  static getBalanceNotification (oldBalance, newBalance, walletName) {
    const notification = {}

    notification.received = oldBalance.amount < newBalance.amount
    notification.amount = Math.abs(oldBalance.amount - newBalance.amount)
    notification.ticker = newBalance.ticker
    notification.walletName = walletName

    return notification
  }

  sendBalanceNotification (balanceNotification) {
    let message = ''
    if (balanceNotification.received) {
      message = `You received ${balanceNotification.amount} ${balanceNotification.ticker}`
    } else {
      message = `You sent ${balanceNotification.amount} ${balanceNotification.ticker}`
    }

    this._registration.showNotification(
      message,
      {
        body: message + (balanceNotification.received ? ' to ' : ' from ') + `your wallet ${balanceNotification.walletName}`,
        lang: 'EN',
        icon: 'https://allmywallets.io/static/android-chrome-192x192.png',
        requireInteraction: true
      }
    )
  }

  sendBackgroundNotification () {
    this._registration.showNotification(
      'Your balances have been synced.',
      {
        silent: true,
        noscreen: true,
        lang: 'EN',
        requireInteraction: false,
        icon: 'https://allmywallets.io/static/android-chrome-192x192.png',
        tag: 'background'
      }
    )
  }
}
