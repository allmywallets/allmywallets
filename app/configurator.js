import { Validator } from 'jsonschema'
import idbKeyval from 'idb-keyval'

export default class Configurator {
  static async getConfiguration () {
    let configuration = await idbKeyval.get('configuration')

    configuration = configuration || { profiles: [ { wallets: [ ] } ] }

    return configuration
  }

  static setConfiguration (configuration) {
    if (!this.validateConfiguration(configuration)) {
      throw new Error('Configuration is not valid')
    }

    return idbKeyval.set('configuration', configuration)
  }

  static validateConfiguration (configuration) {
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

    const configurationSchema = {
      'id': '/Configuration',
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

    return validator.validate(configuration, configurationSchema).valid
  }
}
