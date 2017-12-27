const publicKey = [4, 198, 255, 12, 146, 60, 183, 154, 246, 50, 135, 70, 237, 229, 215, 28, 244, 9, 8, 46, 177, 159, 232, 45, 102, 137, 115, 175, 38, 227, 59, 203, 67, 32, 170, 107, 31, 101, 248, 79, 239, 74, 131, 254, 71, 24, 220, 49, 112, 246, 77, 103, 240, 186, 46, 50, 101, 163, 14, 215, 243, 121, 120, 97, 90]

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
    const result = await Notification.requestPermission()

    return result === 'granted'
  }

  static enablePushNotifications (serviceWorker) {
    serviceWorker.ready.then((registration) => {
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      }).then(function (subscription) {
        fetch(`${process.env.SERVER_URL}/push/register`, {
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
}
