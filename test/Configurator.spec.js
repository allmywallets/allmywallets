/* global describe, it, expect */
import 'isomorphic-fetch'
import Configurator from '../src/manager/configuration.js'

describe('Configurator.js', () => {
  describe('.validateConfig()', () => {
    it('validates a valid config', () => {
      expect(Configurator.validateConfig(
        {
          profiles: [
            {
              wallets: [],
              application: {
                currencies: {
                  primary: 'USD',
                  secondary: 'BTC'
                },
                modules: []
              }
            }
          ],
          application: {
            version: '0.1'
          }
        }
      )).toBe(true)
    })

    it('invalidates empty profiles', () => {
      expect(Configurator.validateConfig(
        {
          profiles: [],
          application: {
            version: '0.1'
          }
        }
      )).toBe(false)
    })

    it('validates a valid wallet config', () => {
      expect(Configurator.validateConfig(
        {
          profiles: [
            {
              wallets: [
                {
                  id: '72e98ac',
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
                },
                modules: []
              }
            }
          ],
          application: {
            version: '0.1'
          }
        }
      )).toBe(true)
    })

    it('invalidates a void config', () => {
      expect(Configurator.validateConfig({})).toBe(false)
    })

    it('invalidates a void profile', () => {
      expect(Configurator.validateConfig(
        {
          profiles: [{}],
          application: {
            version: '0.1'
          }
        }
      )).toBe(false)
    })

    it('invalidates an invalid profiles config', () => {
      expect(Configurator.validateConfig(
        {
          profiles: 'invalid',
          application: {
            version: '0.1'
          }
        }
      )).toBe(false)
    })

    it('invalidates an invalid wallet config', () => {
      expect(Configurator.validateConfig(
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
                },
                modules: []
              }
            }
          ],
          application: {
            version: '0.1'
          }
        }
      )).toBe(false)
    })
  })
})
