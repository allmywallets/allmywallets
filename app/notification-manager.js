export default class NotificationManager {
  static getNotificationState (isSupported, isSelected, isEnabled, isPushEnabled) {
    if (!isSupported) {
      return {
        icon: 'bell-slash',
        title: 'Browser notifications not supported',
        state: 'warning',
        action: false,
        showOnLoad: false
      }
    }

    if (!isSelected) {
      return {
        icon: 'bell-slash',
        title: 'Click to enable browser notifications',
        state: 'warning',
        action: NotificationManager.enableNotifications,
        showOnLoad: true
      }
    }

    if (!isEnabled) {
      return {
        icon: 'bell-slash',
        title: 'Browser notifications are disabled',
        state: 'warning',
        action: false,
        showOnLoad: false
      }
    }

    if (!isPushEnabled) {
      return {
        icon: 'bell',
        title: 'Click to enable push notifications',
        state: 'warning',
        action: NotificationManager.enablePushNotifications,
        showOnLoad: true
      }
    }

    return {
      icon: 'bell',
      title: 'Push notifications are enabled',
      state: false,
      action: false,
      showOnLoad: false
    }
  }

  static async enableNotifications () {
    return Notification.requestPermission()
  }

  static async enablePushNotifications (serviceWorker) {
    return serviceWorker.ready.then(registration => {
      console.log(registration)
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: NotificationManager._urlBase64ToUint8Array('BMb_DJI8t5r2ModG7eXXHPQJCC6xn-gtZolzrybjO8tDIKprH2X4T-9Kg_5HGNwxcPZNZ_C6LjJlow7X83l4YVo')
      }).then(function (subscription) {
        console.log(subscription)
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
