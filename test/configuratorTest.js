import { describe, it } from 'mocha'
import { assert } from 'chai'
import Configurator from '../app/configurator.js'

describe('Configurator', () => {
  describe('#validateConfig()', () => {
    it('validates a valid config', () => {
      assert.isTrue(Configurator.validateConfig(
        {
          profiles: [
            {
              wallets: []
            }
          ]
        }
      ))
    })

    it('validates an empty config', () => {
      assert.isTrue(Configurator.validateConfig(
        {
          profiles: []
        }
      ))
    })

    it('validates a valid wallet config', () => {
      assert.isTrue(Configurator.validateConfig(
        {
          profiles: [
            {
              wallets: [
                {
                  network: 'Network',
                  provider: 'Provider',
                  name: 'Name',
                  parameters: { address: 'XABCDEFG' }
                }
              ]
            }
          ]
        }
      ))
    })

    it('invalidates a void config', () => {
      assert.isFalse(Configurator.validateConfig({}))
    })

    it('invalidates a void profile', () => {
      assert.isFalse(Configurator.validateConfig(
        {
          profiles: [{}]
        }
      ))
    })

    it('invalidates an invalid profiles config', () => {
      assert.isFalse(Configurator.validateConfig(
        {
          profiles: 'invalid'
        }
      ))
    })

    it('invalidates an invalid wallet config', () => {
      assert.isFalse(Configurator.validateConfig(
        {
          profiles: [
            {
              wallets: [
                {
                  provider: 'Provider'
                }
              ]
            }
          ]
        }
      ))
    })
  })
})
