const AbstractExplorer = require('./AbstractExplorer')
const NotSupportedCurrencyError = require('../errors/NotSupportedCurrencyError')
const OnlyEmptyBalancesFound = require('../errors/OnlyEmptyBalancesFound')
const ApiKeyPermissionError = require('../errors/ApiKeyPermissionError')

const crypto = require('crypto')
const queryStringLib = require('querystring')

// TODO : Cors problem
const API_URL = 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v3/'

/**
 * Binance exchange https://www.binance.com/
 */
class Binance extends AbstractExplorer {
  constructor () {
    super()

    this.supportedCurrencies = {BTC: {name: 'Bitcoin', ticker: 'BTC'}}
    this.isExchange = true
    this.dynamicSupportedCurrencies = true
    this.selectedCurrencies = []
  }

  static getDefaultTicker () {
    return 'BTC'
  }

  getSelectedCurrencies () {
    return this.selectedCurrencies
  }

  async binanceApiRequest (endpoint, queryObject, apiKey, secret, method = 'GET') {
    queryObject.timestamp = new Date().getTime()
    const queryString = queryStringLib.stringify(queryObject)
    let url = API_URL + endpoint
    if (queryString === '') {
      url += `?signature=${this._sign(queryString, secret)}`
    } else {
      url += '?' + queryString + `&signature=${this._sign(queryString, secret)}`
    }

    const headers = {
      'X-MBX-APIKEY': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      'origin': '.',
      'x-requested-with': '.'
    }

    const res = await this.constructor._fetchJson(url, {
      method,
      headers
    })

    return res
  }

  async _getBalances ({secret, apiKey}, wallet) {
    this.selectedCurrencies = []
    wallet.balances = []

    const res = await this.binanceApiRequest('account', {recvWindow: 10000}, apiKey, secret)

    if (this.tickers.length === 0) {
      this._getAllNonZeroBalances(res, wallet)
    } else {
      this._getSpecifiedBalances(res, wallet)
    }
  }

  async checkWallets (wallets) {
    wallets.forEach(async wallet => {
      await this._checkApiKeyPermission(wallet)
    })
  }

  async _checkApiKeyPermission ({secret, apiKey}) {
    const res = await this.binanceApiRequest('order', {recvWindow: 10000}, apiKey, secret, 'DELETE')
    if (res.code !== -2015) {
      throw new ApiKeyPermissionError()
    }
  }

  async _getTransactions ({secret, apiKey}, wallet) {
    // Filled in getBalances (cant know the 0 balance in advance) TODO: improve this ?
    wallet.transactions = []
    if (this.tickers.length !== 0) {
      this.tickers.forEach(ticker => {
        wallet.transactions.push([])
      })
    } else if (this.elementsToFetch.includes('transactions') && !this.elementsToFetch.includes('balances')) {
      wallet.transactions = [[]]
    }
  }

  _getAllNonZeroBalances (res, wallet) {
    res.balances.forEach(balance => {
      let amount = parseFloat(balance.free)
      if (amount > 0) {
        wallet.balances.push(amount)
        this.selectedCurrencies.push({name: balance.asset, ticker: balance.asset})

        if (this.elementsToFetch.includes('transactions')) {
          if (!wallet.transactions) { wallet.transactions = [] }
          wallet.transactions.push([])
        }
      }
    })
    if (wallet.balances.length === 0) {
      throw new OnlyEmptyBalancesFound()
    }
  }

  _getSpecifiedBalances (res, wallet) {
    this.tickers.forEach(ticker => {
      let tickerFound = false
      res.balances.forEach(balance => {
        if (balance.asset === ticker) {
          wallet.balances.push(parseFloat(balance.free))
          this.selectedCurrencies.push({name: balance.asset, ticker: balance.asset})
          tickerFound = true
          return false
        }
      })

      if (!tickerFound) {
        throw new NotSupportedCurrencyError(`${ticker} is not supported`)
      }
    })
  }

  _sign (queryString, secret) {
    return crypto.createHmac('sha256', secret).update(queryString).digest('hex')
  }

  static getAddressParam () {
    return [{
      type: 'input',
      inputType: 'text',
      label: 'Binance Api Key',
      model: 'wallets.apiKey',
      required: true
    },
    {
      type: 'input',
      inputType: 'text',
      label: 'Binance secret',
      model: 'wallets.secret',
      required: true
    }]
  }
}

module.exports = Binance
