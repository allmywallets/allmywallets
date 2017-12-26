const AbstractExplorer = require('./AbstractExplorer')
const NotSupportedCurrencyError = require('./errors/NotSupportedCurrencyError')
const OnlyEmptyBalancesFound = require('./errors/OnlyEmptyBalancesFound')

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
  }

  static getDefaultTicker () {
    return 'BTC'
  }

  async binanceApiRequest (endpoint, queryObject, apiKey, secret) {
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
      method: 'GET',
      headers
    })

    if (res.code) {
      throw new Error(JSON.stringify(res))
    }
    return res
  }

  async _getBalances ({secret, apiKey}, wallet) {
    const res = await this.binanceApiRequest('account', {}, apiKey, secret)

    wallet.balances = []

    if (this.tickers.length === 0) {
      this._getAllNonZeroBalances(res, wallet)
    } else {
      this._getSpecifiedBalances(res, wallet)
    }
  }

  async _getTransactions (address, result) {
    result.transactions = [[]]
  }

  _getAllNonZeroBalances (res, wallet) {
    res.balances.forEach(balance => {
      let amount = parseFloat(balance.free)
      if (amount > 0) {
        wallet.balances.push(amount)
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
