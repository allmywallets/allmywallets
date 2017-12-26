const AbstractExplorer = require('./AbstractExplorer')
const crypto = require('crypto')
const queryStringLib = require('querystring')

const API_URL = 'https://api.binance.com/api/v3/'

/**
 * Binance exchange https://www.binance.com/
 */
class Binance extends AbstractExplorer {
  constructor () {
    super()

    this.supportedCurrencies = {BTC: {name: 'Bitcoin', ticker: 'BTC'}}
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
      'X-MBX-APIKEY': apiKey
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

  async _getBalances ({secret, apiKey}, result) {
    const res = await this.binanceApiRequest('account', {}, apiKey, secret)

    result.balances = []
    this.tickers.forEach(ticker => {
      res.balances.forEach(balance => {
        if (balance.asset === ticker) {
          result.balances.push(parseFloat(balance.free))
          return false
        }
      })
    })
  }

  async _getTransactions (address, result) {
    result.transactions = [[]]
  }

  _sign (queryString, secret) {
    return crypto.createHmac('sha256', secret).update(queryString).digest('hex')
  }
}

module.exports = Binance
