/* global describe, it, expect */
import { migrate } from '../../src/migrations/config'

describe('database/migrations.js', () => {
  describe('migrate()', () => {
    it('migrates configuration properly', () => {
      const config = migrate({
        'profiles': [
          {
            'wallets': []
          }
        ],
        'application': {
          'version': '0.0.1'
        }
      }, {
        '0.0.1': { next: '0.1.0' },
        '0.1.0': {
          migrate (config) {
            config.test = true
          }
        }
      })

      expect(config).toEqual({
        'profiles': [
          {
            'wallets': []
          }
        ],
        'application': {
          'version': '0.1.0'
        },
        'test': true
      })
    })

    it('migrates multiple versions at once properly', () => {
      const config = migrate({
        'profiles': [
          {
            'wallets': []
          }
        ],
        'application': {
          'version': '0.0.1'
        }
      }, {
        '0.0.1': { next: '0.1.0' },
        '0.1.0': {
          migrate (config) {
            config.test = true
          },
          next: '0.1.1'
        },
        '0.1.1': {
          migrate (config) {
            config.toast = true
          }
        }
      })

      expect(config).toEqual({
        'profiles': [
          {
            'wallets': []
          }
        ],
        'test': true,
        'toast': true,
        'application': {
          'version': '0.1.1'
        }
      })
    })
  })
})
