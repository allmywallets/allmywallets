export default class NotificationManager {
  static getNotificationState (isSupported, isSelected, isEnabled) {
    if (!isSupported) {
      return {
        icon: 'bell-slash',
        title: 'Notifications not supported',
        state: 'danger',
        action: false,
        showOnLoad: false
      }
    }

    if (!isSelected) {
      return {
        icon: 'bell-slash',
        title: 'Click to enable push notifications',
        state: 'warning',
        action: NotificationManager.enablePushNotifications,
        showOnLoad: true
      }
    }

    if (!isEnabled) {
      return {
        icon: 'bell-slash',
        title: 'Browser notifications disabled',
        state: 'warning',
        action: false,
        showOnLoad: false
      }
    }

    return {
      icon: 'bell',
      title: 'Push notifications enabled',
      state: false,
      action: false,
      showOnLoad: false
    }
  }

  static async enablePushNotifications (serviceWorker) {
    return serviceWorker.ready.then(registration => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: NotificationManager._urlBase64ToUint8Array('BEtisxY__U2bGRrVSc_ukaqJ6gqaXiwxdh3lamdD2i4gqugmS65LvV9lagSm34lJcKiG0TEfImRnuxxH8_-imr0')
      }).then(function (subscription) {
        return fetch(`${process.env.SERVER_URL}/push/register`, {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        })
          .catch(e => console.error(e))
      })
    })
  }

  static _urlBase64ToUint8Array (base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}