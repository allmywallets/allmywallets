import { Validator } from 'jsonschema'
import idbKeyval from 'idb-keyval'
import Proxy from './providers'

export default class Configurator {
  static async getConfig () {
    let config = await idbKeyval.get('config')

    config = config || Configurator.getDefaultConfiguration()

    return config
  }

  static async getWallets () {
    const config = await Configurator.getConfig()

    return config.profiles[0].wallets
  }

  static async getWallet (walletId) {
    const wallets = await Configurator.getWallets()

    const wallet = wallets.find(wallet => wallet.id === walletId)

    if (!wallet) {
      throw new Error(`Wallet ${walletId} is not defined`)
    }

    return wallet
  }

  static async setConfig (config) {
    if (!this.validateConfig(config)) {
      throw new Error('Config is not valid')
    }

    return idbKeyval.set('config', config)
  }

  static async validateWalletConfig (wallet) {
    return new Proxy(wallet).checkParameters()
  }

  static validateWalletIds (config) {
    if (config.profiles.length === 0) {
      return true
    }

    const ids = []
    const wallets = config.profiles[0].wallets
    for (const key in wallets) {
      if (ids.includes(wallets[key].id)) {
        throw new Error('Config has duplicated ids')
      }

      ids.push(wallets[key].id)
    }

    return true
  }

  static validateConfig (config) {
    const walletSchema = {
      id: '/Wallet',
      type: 'object',
      properties: {
        'id': {
          type: 'string',
          minLength: 20,
          maxLength: 20
        },
        'name': { type: 'string', minLength: 1, maxLength: 30 },
        'network': { type: 'string' },
        'provider': { type: 'string' },
        'parameters': { type: 'object' }
      },
      required: ['id', 'name', 'network', 'provider', 'parameters']
    }

    const configSchema = {
      id: '/Config',
      type: 'object',
      properties: {
        'profiles': {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              'wallets': {
                type: 'array',
                items: {
                  $ref: '/Wallet'
                }
              },
              'application': {
                type: 'object',
                properties: {
                  'currencies': {
                    type: 'object',
                    properties: {
                      'primary': { type: 'string', minLength: 3, pattern: '^[A-Z]+$' },
                      'secondary': { type: 'string', minItems: 3, pattern: '^[A-Z]+$' }
                    },
                    required: ['primary', 'secondary']
                  }
                },
                required: ['currencies']
              }
            },
            required: ['wallets', 'application']
          }
        },
        'application': {
          type: 'object',
          properties: {
            'version': { type: 'string' },
            'language': { type: 'string' }
          },
          required: ['version']
        }
      },
      required: ['profiles', 'application']
    }

    const validator = new Validator()

    validator.addSchema(walletSchema, '/Wallet')

    return validator.validate(config, configSchema).valid && Configurator.validateWalletIds(config)
  }

  static getDefaultConfiguration () {
    return {
      profiles: [{
        wallets: [],
        application: {
          currencies: {
            primary: 'USD',
            secondary: 'BTC'
          }
        }
      }],
      application: {
        version: 'unknown'
      }
    }
  }

  static async getVersion () {
    return fetch('https://api.github.com/repos/allmywallets/allmywallets/releases')
      .then(response => response.json())
      .then(data => {
        return {
          current: process.env.APP_VERSION,
          releaseNotes: data[0].body,
          upstream: data[0].tag_name
        }
      })
      .catch(() => {
        return {
          current: 'unknown',
          releaseNotes: '',
          upstream: 'unknown'
        }
      })
  }
}
