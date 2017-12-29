const AbstractExplorer = require('./AbstractExplorer')

/**
 * IotaNative
 */
class IotaNative extends AbstractExplorer {
  constructor (params) {
    super()

    this.params = params || {}
    this.params.node = this.params.node || 'https://iri3-api.iota.fm:443'

    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-IOTA-API-Version': '1'
    }
  }

  static getSupportedCurrencies () {
    return {IOTA: {name: 'Iota', ticker: 'IOTA'}}
  }

  static getDefaultTicker () {
    return 'IOTA'
  }

  async iotaApiRequest (body) {
    const res = await this.constructor._fetchJson(this.params.node, {
      method: 'POST',
      headers: this.headers,
      body
    })

    if (res.error) {
      throw new Error(res.error)
    }
    return res
  }

  async _getBalances (address, result) {
    const res = await this.iotaApiRequest(JSON.stringify({
      addresses: [address],
      command: 'getBalances',
      threshold: 100
    }))

    result.balances = [parseInt(res.balances[0])]
  }

  async _getTransactions (address, result) {
    const res = await this.iotaApiRequest(JSON.stringify({
      addresses: [address],
      command: 'findTransactions',
      threshold: 100
    }))
    // TODO
    result.transactions = [[]]
  }

  static getExplorerParams () {
    return [{
      type: 'select',
      label: 'Node',
      model: 'node',
      values: ['https://iota.thathost.net', 'https://iri3-api.iota.fm:443'],
      required: true
    }]
  }
}

module.exports = IotaNative
