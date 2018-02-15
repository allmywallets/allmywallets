import { describe, it } from 'mocha'
import { assert } from 'chai'
import Balance from '../../src/model/Balance'
import BrowserNotification from '../../src/model/BrowserNotification'
import { getNotification } from '../../src/notification/balance-notifier'
import Transaction from '../../src/model/Transaction'
import Wallet from '../../src/model/Wallet'

describe('notification/balance-notifier.js', () => {
  describe('getNotification()', () => {
    it('generates a valid notification', () => {
      const diff = {
        amount: 5,
        transactions: [
          new Transaction('0x01', '', '0x0', 5)
        ],
        balance: new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 10, new Date())
      }

      const notification = getNotification(diff)

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
