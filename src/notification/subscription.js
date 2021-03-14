const PUBLIC_KEY =
  "BEtisxY__U2bGRrVSc_ukaqJ6gqaXiwxdh3lamdD2i4gqugmS65LvV9lagSm34lJcKiG0TEfImRnuxxH8_-imr0"

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const enablePushNotifications = async serviceWorker => {
  return serviceWorker.ready.then(registration => {
    return registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
      })
      .then(function(subscription) {
        return fetch(`${process.env.VUE_APP_SERVER_URL}/push/register`, {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: new Headers({
            "Content-Type": "application/json"
          })
        }).catch(e => console.error(e))
      })
  })
}

export const getNotificationState = (isSupported, isSelected, isAllowed) => {
  if (!isSupported) {
    return {
      icon: "bell-slash",
      title: "Notifications not supported",
      state: "danger",
      action: false,
      showOnLoad: false
    }
  }

  if (!isSelected) {
    return {
      icon: "bell-slash",
      title: "Click to enable push notifications",
      state: "warning",
      action: enablePushNotifications,
      showOnLoad: true
    }
  }

  if (!isAllowed) {
    return {
      icon: "bell-slash",
      title: "Browser notifications disabled",
      state: "warning",
      action: false,
      showOnLoad: false
    }
  }

  return {
    icon: "bell",
    title: "Push notifications enabled",
    state: false,
    action: false,
    showOnLoad: false
  }
}
