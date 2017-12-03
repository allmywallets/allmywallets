import SchemaObject from 'schema-object'

export default class Storage {
  static get configuration () {
    let configuration = localStorage.getItem('configuration')

    if (configuration !== null) {
      configuration = JSON.parse(configuration)
    } else {
      configuration = {}
    }

    return this.parseConfiguration(configuration)
  }

  static set configuration (configuration) {
    localStorage.setItem('configuration', JSON.stringify(this.parseConfiguration(configuration)))
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
