const AbstractExchangeExplorer = require('./AbstractExchangeExplorer')
const NotSupportedCurrencyError = require('../errors/NotSupportedCurrencyError')
const OnlyEmptyBalancesFound = require('../errors/OnlyEmptyBalancesFound')

const crypto = require('crypto')
const queryStringLib = require('querystring')

// TODO : Cors problem
const API_URL = 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v3/'
const PUBLIC_API_URL = 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/'

/**
 * Binance exchange https://www.binance.com/
 */
class Binance extends AbstractExchangeExplorer {
  constructor () {
    super()

    this.selectedCurrencies = []
    this.supportedCurrencies = {BTC: {name: 'Bitcoin', ticker: 'BTC'}}
  }

  static async getSupportedCurrencies () {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'origin': '.',
      'x-requested-with': '.'
    }
    const currencies = await AbstractExchangeExplorer._fetchJson(`${PUBLIC_API_URL}ticker/allPrices`, {headers})
    const newCurrencies = {}

    currencies.forEach(curr => {
      const ticker = curr.symbol.replace('BTC', '').replace('ETH', '').replace('BNB', '').replace('USDT', '')
      if (ticker.length === 0) { return }
      if (newCurrencies[ticker]) { return }

      newCurrencies[ticker] = {name: ticker, ticker}
    })
    return newCurrencies
  }

  async _binanceApiRequest (endpoint, queryObject, apiKey, secret, method = 'GET') {
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

  async _checkApiKeyPermission ({secret, apiKey}) {
    const res = await this._binanceApiRequest('order', {recvWindow: 10000}, apiKey, secret, 'DELETE')
    return res.code === -2015
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

  async _getAllNonZeroBalances ({secret, apiKey}, wallet) {
    const res = await this._binanceApiRequest('account', {recvWindow: 10000}, apiKey, secret)

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

  async _getSpecifiedBalances ({secret, apiKey}, wallet) {
    const res = await this._binanceApiRequest('account', {recvWindow: 10000}, apiKey, secret)

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
