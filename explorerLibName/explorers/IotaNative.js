const AbstractExplorer = require('./AbstractExplorer')

/**
 * IotaNative
 */
class IotaNative extends AbstractExplorer {
  constructor (params) {
    super()

    this.params = params || {}
    this.params.node = this.params.node || 'http://cryptoiota.win:14265'

    this.supportedCurrencies = {IOTA: {name: 'Iota', ticker: 'IOTA'}}
  }

  static getDefaultTicker () {
    return 'IOTA'
  }

  async _getBalances (address, result) {
    const headers = {
      'Content-Type': 'application/json',
      'X-IOTA-API-Version': '1'
    }

    const res = await this.constructor._fetchJson(this.params.node, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        addresses: [address],
        command: 'getBalances',
        threshold: 100
      })
    })

    if (res.error) {
      throw new Error(res.error)
    }

    result.balances = [parseInt(res.balances[0])]
  }

  async _getTransactions (address, result) {
    // TODO
    result.transactions = [[]]
  }
}

module.exports = IotaNative
