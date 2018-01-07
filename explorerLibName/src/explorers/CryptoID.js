const AbstractExplorer = require('./AbstractExplorer')
const NotSupportedCurrencyError = require('../errors/NotSupportedCurrencyError')

// TODO : cors
const API_URL = 'https://cors-anywhere.herokuapp.com/https://chainz.cryptoid.info/'

/**
 *  CryptoID blockchain explorers https://chainz.cryptoid.info/
 */
class CryptoID extends AbstractExplorer {
  constructor (params) {
    super()

    this.params = params || {}
    if (!this.params.apiKey) {
      throw new Error('Api key is required for CryptoID, request it here https://chainz.cryptoid.info/api.key.dws')
    }

    this.supportedCurrencies = {BTC: {name: 'Bitcoin', ticker: 'BTC'}}
  }

  static async getSupportedCurrencies () {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'origin': '.',
      'x-requested-with': '.'
    }
    const currencies = await AbstractExplorer._fetchJson(`${API_URL}/explorer/api.dws?q=summary`, {headers})
    const newCurrencies = {}

    for (let curr in currencies) {
      newCurrencies[curr.toUpperCase()] = {name: currencies[curr].name, ticker: curr.toUpperCase()}
    }
    return newCurrencies
  }

  static get dynamicSupportedCurrencies () {
    return true
  }

  async _getBalances (address) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'origin': '.',
      'x-requested-with': '.'
    }

    const balances = []
    const promises = []
    this.tickers.forEach(async ticker => {
      promises.push(this.constructor._fetchJson(`${API_URL}/${ticker.toLowerCase()}/api.dws?q=getbalance&a=${address}&key=${this.params.apiKey}`, {headers})
                                    .catch(() => { throw new NotSupportedCurrencyError(`${ticker} is not supported`) }))
    })
    let apiBalances = await Promise.all(promises)
    apiBalances.forEach(balance => {
      balances.push(balance)
    })

    return balances
  }

  async _getTransactions (address) {
    const transactions = []
    this.tickers.forEach(ticker => {
      transactions.push([])
    })

    return transactions
  }

  static getExplorerParams () {
    return [{
      type: 'input',
      inputType: 'text',
      label: 'CryptoID api key, redeem it here https://chainz.cryptoid.info/api.key.dws',
      model: 'apiKey',
      required: true
    }]
  }
}

module.exports = CryptoID
