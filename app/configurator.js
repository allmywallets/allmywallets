import { Validator } from 'jsonschema'
import idbKeyval from 'idb-keyval'
import Proxy from './providers'

export default class Configurator {
  static async getConfig () {
    let config = await idbKeyval.get('config')

    config = config || { profiles: [ { wallets: [ ] } ] }

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

    await this.validateWalletsArgs(config)

    return idbKeyval.set('config', config)
  }

  static async validateWalletsArgs (config) {
    config.profiles[0].wallets.forEach(async wallet => {
      await new Proxy(wallet.network, wallet.provider, wallet.parameters).checkParameters(wallet.parameters)
    })
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
      'id': '/Wallet',
      'type': 'object',
      'properties': {
        'id': {
          'type': 'string',
          'minLength': 20,
          'maxLength': 20
        },
        'name': { 'type': 'string' },
        'network': { 'type': 'string' },
        'provider': { 'type': 'string' },
        'parameters': { 'type': 'object' }
      },
      'required': ['id', 'name', 'network', 'provider', 'parameters']
    }

    const configSchema = {
      'id': '/Config',
      'type': 'object',
      'properties': {
        'profiles': {
          'type': 'array',
          'items': {
            'type': 'object',
            'properties': {
              'wallets': {
                'type': 'array',
                'items': {
                  '$ref': '/Wallet'
                }
              }
            },
            'required': ['wallets']
          }
        }
      },
      'required': ['profiles']
    }

    const validator = new Validator()

    validator.addSchema(walletSchema, '/Wallet')

    return validator.validate(config, configSchema).valid && Configurator.validateWalletIds(config)
  }

  static async getVersion () {
    return fetch('https://api.github.com/repos/allmywallets/allmywallets/releases')
      .then(response => response.json())
      .then(data => {
        return {
          current: process.env.APP_VERSION,
          upstream: data[0].tag_name
        }
      })
      .catch(() => {
        return {
          current: 'unknown',
          upstream: 'unknown'
        }
      })
  }
}
