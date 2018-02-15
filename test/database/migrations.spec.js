import { describe, it } from 'mocha'
import { assert } from 'chai'
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
        '0.0.1': {
          migrate (config) {
            config.test = true
          },
          next: '0.1.0'
        },
        '0.1.0': {}
      })

      assert.deepEqual(config, {
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
        '0.0.1': {
          migrate (config) {
            config.test = true
          },
          next: '0.1.0'
        },
        '0.1.0': {
          migrate (config) {
            config.toast = true
          },
          next: '0.1.1'
        },
        '0.1.1': {}
      })

      assert.deepEqual(config, {
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
