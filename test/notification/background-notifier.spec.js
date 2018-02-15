import { describe, it } from 'mocha'
import { assert } from 'chai'
import { getNotification } from '../../src/notification/background-notifier'

describe('notification/background-notifier.js', () => {
  describe('getNotification()', () => {
    it('returns a background notification', () => {
      const notification = getNotification()

      assert.equal(notification.options.tag, 'background')
      assert.isFalse(notification.options.requireInteraction)
      assert.isTrue(notification.options.noscreen)
      assert.isTrue(notification.options.silent)
    })
  })
})
