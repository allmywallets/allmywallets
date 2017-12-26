const AbstractExplorer = require('./AbstractExplorer')

/**
 * IotaNative
 */
class IotaNative extends AbstractExplorer {
  constructor (params) {
    super()

    this.params = params || {}
    this.params.node = this.params.node || 'https://potato.iotasalad.org:14265'

    this.headers = {
      'Content-Type': 'application/json',
      'X-IOTA-API-Version': '1'
    }

    this.supportedCurrencies = {IOTA: {name: 'Iota', ticker: 'IOTA'}}
  }

  static getDefaultTicker () {
    return 'IOTA'
  }

  async iotaApiRequest (body) {
    const res = this.constructor._fetchJson(this.params.node, {
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
      values: ['https://iota.thathost.net', 'https://potato.iotasalad.org:14265',
        'https://durian.iotasalad.org:14265', 'https://peanut.iotasalad.org:14265', 'https://tuna.iotasalad.org:14265', 'https://turnip.iotasalad.org:14265'],
      required: true
    }]
  }
}

module.exports = IotaNative
