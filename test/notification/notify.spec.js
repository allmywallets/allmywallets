import { describe, it } from 'mocha'
import { assert } from 'chai'
import BrowserNotification from '../../app/model/BrowserNotification'
import { sendNotification } from '../../app/notification/notify'

describe('notification/notify.js', () => {
  describe('sendNotification()', () => {
    it('sends a notification', () => {
      const notification = new BrowserNotification(
        'You received 5 ETH',
        {
          'body': 'You received 5 ETH to your wallet MyWallet',
          'requireInteraction': true
        }
      )

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

      sendNotification(notification, registration)
    })

    it('does not override set options', () => {
      const notification = new BrowserNotification(
        'You received 5 ETH',
        {
          'body': 'You received 5 ETH to your wallet MyWallet',
          'requireInteraction': true,
          'lang': 'FR'
        }
      )

      const registration = {
        showNotification: (message, config) => {
          assert.equal(message, 'You received 5 ETH')
          assert.deepEqual(config, {
            'body': 'You received 5 ETH to your wallet MyWallet',
            'icon': 'https://allmywallets.io/static/android-chrome-192x192.png',
            'lang': 'FR',
            'requireInteraction': true
          })
        }
      }

      sendNotification(notification, registration)
    })
  })
})
