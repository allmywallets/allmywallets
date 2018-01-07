const AbstractExplorer = require('./AbstractExplorer')
const ERC20Token = require('./ERC20Tokens.json')

const API_URL = 'https://api.etherscan.io/api'

class EthereumEtherscan extends AbstractExplorer {
  constructor (parameters) {
    super()

    if (parameters && parameters.customTokens) {
      this.supportedCurrencies = Object.assign(this.supportedCurrencies, parameters.customTokens)
    }
  }

  static getSupportedCurrencies () {
    const currencies = {ETH: {name: 'Ethereum', ticker: 'ETH', decimals: 18}}
    return Object.assign(currencies, ERC20Token)
  }

  static getDefaultTicker () {
    return 'ETH'
  }

  async _getBalances (address) {
    const promises = []
    this.tickers.forEach(ticker => {
      if (ticker === this.constructor.getDefaultTicker()) { // ETH
        promises.push(this.constructor._fetchJson(`${API_URL}?module=account&action=balance&address=${address}&sort=desc&tag=latest`))
      } else { // Tokens
        promises.push(this.constructor._fetchJson(`${API_URL}?module=account&action=tokenbalance&contractaddress=${this.supportedCurrencies[ticker].contractAddress}&address=${address}&tag=latest`))
      }
    })

    const results = await Promise.all(promises)

    const balances = []
    for (let i = 0; i < this.tickers.length; i++) {
      let ticker = this.tickers[i]
      let decimals = this.supportedCurrencies[ticker].decimals || 18
      balances.push(results[i].result / Math.pow(10, decimals))
    }

    return balances
  }

  async _getTransactions (address) {
    const res = await this.constructor._fetchJson(`${API_URL}?module=account&action=txlist&address=${address}&sort=desc&tag=latest`)
    const apiResTransactions = res.result

    apiResTransactions.forEach(tx => {
      tx.type = tx.from === this.address ? 'out' : 'in'

      tx.id = tx.hash
      delete tx.hash

      tx.amount = tx.value
      delete tx.value
    })

    // TODO : Retrieve correct transactions for tokens
    const transactions = []
    this.tickers.forEach(ticker => {
      transactions.push(apiResTransactions)
    })

    return transactions
  }

  static getExplorerParameters () {
    return [{
      type: 'input',
      inputType: 'text',
      label: 'Custom tokens (optional)',
      model: 'customTokens'
    }]
  }
}

module.exports = EthereumEtherscan
