import { Validator } from 'jsonschema'
import idbKeyval from 'idb-keyval'

export default class Configurator {
  static async getConfig () {
    let config = await idbKeyval.get('config')

    config = config || { profiles: [ { wallets: [ ] } ] }

    return config
  }

  static async getWallet (walletId) {
    const config = await Configurator.getConfig()

    const wallets = config.profiles[0].wallets

    if (walletId > wallets.length) {
      throw new Error(`Wallet ${walletId} is not defined`)
    }

    return wallets[walletId]
  }

  static setConfig (config) {
    if (!this.validateConfig(config)) {
      throw new Error('Config is not valid')
    }

    return idbKeyval.set('config', config)
  }

  static validateConfig (config) {
    const walletSchema = {
      'id': '/Wallet',
      'type': 'object',
      'properties': {
        'name': { 'type': 'string' },
        'network': { 'type': 'string' },
        'provider': { 'type': 'string' },
        'parameters': { 'type': 'object' }
      },
      'required': ['name', 'network', 'provider', 'parameters']
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

    return validator.validate(config, configSchema).valid
  }
}
