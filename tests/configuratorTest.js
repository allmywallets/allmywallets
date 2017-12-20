import { describe, it } from 'mocha'
import { assert } from 'chai'
import Configurator from '../app/configurator.js'

describe('Configurator', () => {
  describe('#validateConfiguration()', () => {
    it('validates a valid configuration', () => {
      assert.isTrue(Configurator.validateConfiguration(
        {
          profiles: [
            {
              wallets: []
            }
          ]
        }
      ))
    })

    it('validates an empty configuration', () => {
      assert.isTrue(Configurator.validateConfiguration(
        {
          profiles: []
        }
      ))
    })

    it('validates a valid wallet configuration', () => {
      assert.isTrue(Configurator.validateConfiguration(
        {
          profiles: [
            {
              wallets: [
                {
                  provider: 'Provider',
                  currency: 'Currency',
                  parameters: { address: 'XABCDEFG' }
                }
              ]
            }
          ]
        }
      ))
    })

    it('invalidates a void configuration', () => {
      assert.isFalse(Configurator.validateConfiguration({}))
    })

    it('invalidates a void profile', () => {
      assert.isFalse(Configurator.validateConfiguration(
        {
          profiles: [{}]
        }
      ))
    })

    it('invalidates an invalid profiles configuration', () => {
      assert.isFalse(Configurator.validateConfiguration(
        {
          profiles: 'invalid'
        }
      ))
    })

    it('invalidates an invalid wallet configuration', () => {
      assert.isFalse(Configurator.validateConfiguration(
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
