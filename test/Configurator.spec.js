import { describe, it } from 'mocha'
import { assert } from 'chai'
import Configurator from '../app/configurator.js'

describe('Configurator.js', () => {
  describe('.validateConfig()', () => {
    it('validates a valid config', () => {
      assert.isTrue(Configurator.validateConfig(
        {
          profiles: [
            {
              wallets: [],
              application: {
                currencies: {
                  primary: 'USD',
                  secondary: 'BTC'
                }
              }
            }
          ],
          application: {
            version: '0.1'
          }
        }
      ))
    })

    it('invalidates empty profiles', () => {
      assert.isFalse(Configurator.validateConfig(
        {
          profiles: [],
          application: {
            version: '0.1'
          }
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
                  id: '72e98ac9b08e34a816af',
                  network: 'Network',
                  provider: 'Provider',
                  name: 'Name',
                  parameters: { address: 'XABCDEFG' }
                }
              ],
              application: {
                currencies: {
                  primary: 'USD',
                  secondary: 'BTC'
                }
              }
            }
          ],
          application: {
            version: '0.1'
          }
        }
      ))
    })

    it('invalidates a void config', () => {
      assert.isFalse(Configurator.validateConfig({}))
    })

    it('invalidates a void profile', () => {
      assert.isFalse(Configurator.validateConfig(
        {
          profiles: [{}],
          application: {
            version: '0.1'
          }
        }
      ))
    })

    it('invalidates an invalid profiles config', () => {
      assert.isFalse(Configurator.validateConfig(
        {
          profiles: 'invalid',
          application: {
            version: '0.1'
          }
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
              ],
              application: {
                currencies: {
                  primary: 'USD',
                  secondary: 'BTC'
                }
              }
            }
          ],
          application: {
            version: '0.1'
          }
        }
      ))
    })
  })
})
