const AbstractExplorer = require('./AbstractExplorer')
const ERC20Token = require('./ERC20Tokens.json')

const API_URL = 'https://api.etherscan.io/api'

class EthereumEtherscan extends AbstractExplorer {
  constructor (params) {
    super()

    this.defaultTicker = 'ETH'
    this.supportedCurrencies = {ETH: {name: 'Ethereum', ticker: 'ETH', decimals: 18}}
    this.supportedCurrencies = Object.assign(this.supportedCurrencies, ERC20Token)
    if (params && params.customTokens) {
      this.supportedCurrencies = Object.assign(this.supportedCurrencies, params.customTokens)
    }
  }

  async _getBalances (address, result) {
    const promises = []
    this.tickers.forEach(ticker => {
      if (ticker === this.defaultTicker) { // ETH
        promises.push(this.constructor._fetchJson(`${API_URL}?module=account&action=balance&address=${address}&sort=desc&tag=latest`))
      } else { // Tokens
        promises.push(this.constructor._fetchJson(`${API_URL}?module=account&action=tokenbalance&contractaddress=${this.supportedCurrencies[ticker].contractAddress}
                                                                &address=${address}&tag=latest`))
      }
    })

    const results = await Promise.all(promises)

    result.balances = []
    for (let i = 0; i < this.tickers.length; i++) {
      let ticker = this.tickers[i]
      let decimals = this.supportedCurrencies[ticker].decimals
      result.balances.push(results[i].result / Math.pow(10, decimals))
    }
  }

  async _getTransactions (address, result) {
    const res = await this.constructor._fetchJson(`${API_URL}?module=account&action=txlist&address=${address}&sort=desc&tag=latest`)
    const transactions = res.result

    transactions.forEach(tx => {
      tx.type = tx.from === this.address ? 'out' : 'in'

      tx.id = tx.hash
      delete tx.hash

      tx.amount = tx.value
      delete tx.value
    })

    // TODO : Retrieve correct transactions for tokens
    result.transactions = []
    this.tickers.forEach(ticker => {
      result.transactions.push(transactions)
    })
  }
}

module.exports = EthereumEtherscan
