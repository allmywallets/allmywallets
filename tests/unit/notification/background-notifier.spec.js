import { getNotification } from "../../../src/notification/background-notifier"

describe("notification/background-notifier.js", () => {
  describe("getNotification()", () => {
    it("returns a background notification", () => {
      const notification = getNotification()

      expect(notification.options.tag).toBe("background")
      expect(notification.options.requireInteraction).toBe(false)
      expect(notification.options.noscreen).toBe(true)
      expect(notification.options.silent).toBe(true)
    })
  })
})
