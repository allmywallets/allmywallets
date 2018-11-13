/* global describe, it, expect */
import BrowserNotification from '../../src/model/BrowserNotification'
import { sendNotification } from '../../src/notification/notify'

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
          expect(message).toBe('You received 5 ETH')
          expect(config).toEqual({
            'body': 'You received 5 ETH to your wallet MyWallet',
            'icon': 'https://amw.app/static/android-chrome-192x192.png',
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
          expect(message).toBe('You received 5 ETH')
          expect(config).toEqual({
            'body': 'You received 5 ETH to your wallet MyWallet',
            'icon': 'https://amw.app/static/android-chrome-192x192.png',
            'lang': 'FR',
            'requireInteraction': true
          })
        }
      }

      sendNotification(notification, registration)
    })
  })
})
