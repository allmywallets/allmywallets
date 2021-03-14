export const sendNotification = (notification, registration) => {
  const defaultOptions = {
    lang: "EN",
    icon: "https://amw.app/static/android-chrome-192x192.png"
  }

  registration.showNotification(
    notification.title,
    Object.assign(defaultOptions, notification.options)
  )
}
