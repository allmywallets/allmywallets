import SchemaObject from 'schema-object'
import idbKeyval from 'idb-keyval'

export default class Storage {
  static async getConfiguration () {
    let configuration = await idbKeyval.get('configuration')

    configuration = configuration || { profiles: [ { wallets: [ ] } ] }

    return this.parseConfiguration(configuration)
  }

  static setConfiguration (configuration) {
    return idbKeyval.set('configuration', this.parseConfiguration(configuration).toObject())
  }

  static parseConfiguration (configuration) {
    return new this.ConfigurationSchema(configuration)
  }

  static get ConfigurationSchema () {
    const NotEmptyString = { type: String, minLength: 1 }

    const Wallet = new SchemaObject({
      currency: NotEmptyString,
      provider: NotEmptyString,
      parameters: {
        name: NotEmptyString,
        address: NotEmptyString
      }
    })

    return new SchemaObject({
      profiles: [ { wallets: [Wallet] } ]
    })
  }
}
