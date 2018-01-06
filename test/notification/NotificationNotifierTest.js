import { describe, it } from 'mocha'
import { assert } from 'chai'
import NotificationNotifier from '../../app/notification/NotificationNotifier'
import Balance from '../../app/model/Balance'

describe('NotificationNotifier', () => {
  describe('#shouldNotify()', () => {
    it('returns true only if balances have different amounts', () => {
      const oldBalance = new Balance('ethereum', 'ETH', 10, new Date(), [])
      const newBalance = new Balance('ethereum', 'ETH', 15, new Date(), [])

      assert.isTrue(NotificationNotifier.shouldNotify(oldBalance, newBalance))
      const otherBalance = new Balance('ethereum', 'ETH', 10, new Date(), [])

      assert.isFalse(NotificationNotifier.shouldNotify(oldBalance, otherBalance))
    })

    it('returns false if one of the balances is undefined', () => {
      const balance = new Balance('ethereum', 'ETH', 10, new Date(), [])

      assert.isFalse(NotificationNotifier.shouldNotify(balance))
      assert.isFalse(NotificationNotifier.shouldNotify(undefined, balance))
    })
  })

  describe('#getBalanceNotification()', () => {
    it('generates a valid notification', () => {
      const oldBalance = new Balance('ethereum', 'ETH', 10, new Date(), [])
      const newBalance = new Balance('ethereum', 'ETH', 15, new Date(), [])

      assert.deepEqual(
        NotificationNotifier.getBalanceNotification(oldBalance, newBalance, 'wallet'),
        {
          received: true,
          amount: 5,
          ticker: 'ETH',
          walletName: 'wallet'
        }
      )
    })
  })

  describe('#sendBalanceNotification()', () => {
    it('sends a valid notification text', () => {
      const notification = {
        received: true,
        amount: 5,
        ticker: 'ETH',
        walletName: 'MyWallet'
      }

      const registration = {
        showNotification: (message, config) => {
          assert.equal(message, 'You received 5 ETH')
          assert.deepEqual(config, {
            'body': 'You received 5 ETH to your wallet MyWallet',
            'icon': 'https://allmywallets.io/static/android-chrome-192x192.png',
            'lang': 'EN',
            'requireInteraction': true
          })
        }
      }

      const notifier = new NotificationNotifier(registration)
      notifier.sendBalanceNotification(notification)
    })
  })
})
