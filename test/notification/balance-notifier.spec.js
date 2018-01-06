import { describe, it } from 'mocha'
import { assert } from 'chai'
import Balance from '../../app/model/Balance'
import BrowserNotification from '../../app/model/BrowserNotification'
import { shouldNotify, getNotification } from '../../app/notification/balance-notifier'

describe('notification/balance-notifier.js', () => {
  describe('shouldNotify()', () => {
    it('returns true only if balances have different amounts', () => {
      const oldBalance = new Balance('ethereum', 'ETH', 10, new Date(), [])
      const newBalance = new Balance('ethereum', 'ETH', 15, new Date(), [])

      assert.isTrue(shouldNotify(oldBalance, newBalance))
      const otherBalance = new Balance('ethereum', 'ETH', 10, new Date(), [])

      assert.isFalse(shouldNotify(oldBalance, otherBalance))
    })

    it('returns false if one of the balances is undefined', () => {
      const balance = new Balance('ethereum', 'ETH', 10, new Date(), [])

      assert.isFalse(shouldNotify(balance))
      assert.isFalse(shouldNotify(undefined, balance))
    })
  })

  describe('getNotification()', () => {
    it('generates a valid notification', () => {
      const oldBalance = new Balance('ethereum', 'ETH', 10, new Date(), [])
      const newBalance = new Balance('ethereum', 'ETH', 15, new Date(), [])

      const notification = getNotification(oldBalance, newBalance, 'MyWallet')

      assert.instanceOf(notification, BrowserNotification)
      assert.equal(notification.title, 'You received 5 ETH')
      assert.deepEqual(
        notification.options,
        {
          body: 'You received 5 ETH to your wallet MyWallet.',
          requireInteraction: true
        }
      )
    })
  })
})
