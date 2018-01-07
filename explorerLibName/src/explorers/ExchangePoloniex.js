const AbstractExchangeExplorer = require('./AbstractExchangeExplorer')
const NotSupportedCurrencyError = require('../errors/NotSupportedCurrencyError')

const crypto = require('crypto')
const queryStringLib = require('querystring')
const nonce = require('nonce')()
const URLSearchParams = require('url-search-params')

// TODO : CORS
const PRIVATE_API = 'https://cors-anywhere.herokuapp.com/https://poloniex.com/tradingApi'
const RETURN_TICKER_API = 'https://poloniex.com/public?command=returnTicker'

/**
 * Poloniex exchange https://poloniex.com/
 */
class ExchangePoloniex extends AbstractExchangeExplorer {
  static async getSupportedCurrencies () {
    const currencies = {}
    const res = await AbstractExchangeExplorer._fetchJson(RETURN_TICKER_API)
    Object.keys(res).forEach(pair => {
      pair.split('_').forEach(ticker => {
        currencies[ticker] = {name: ticker, ticker}
      })
    })

    return currencies
  }

  async _poloniexPrivateApiRequest (command, queryObject, apiKey, secret, method = 'POST') {
    queryObject.command = command
    queryObject.nonce = nonce()
    const queryString = queryStringLib.stringify(queryObject)
    const headers = {
      'Key': apiKey,
      'Sign': this._sign(queryString, secret),
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'origin': '.',
      'x-requested-with': '.'
    }
    return this.constructor._fetchJson(PRIVATE_API, {
      method,
      headers,
      body: new URLSearchParams(queryString)
    })
  }

  async _checkApiKeyPermission ({secret, apiKey}) {
    // const resTrade = await this._poloniexPrivateApiRequest('sell', {currencyPair: 'BTC_ETH', rate: 5000, amount: 0.000001}, apiKey, secret)
    // const tradePermission = resTrade.error !== 'This API key does not have permission to trade.'
    const tradePermission = false

    const resWithdraw = await this._poloniexPrivateApiRequest('withdraw', {}, apiKey, secret)
    const withdrawPermission = resWithdraw.error !== 'Permission to withdraw denied.'

    return !tradePermission && !withdrawPermission
  }

  async _getAllNonZeroBalances ({secret, apiKey}) {
    const resBalances = await this._poloniexPrivateApiRequest('returnBalances', {}, apiKey, secret)

    const nonZeroBalanceTickers = []
    const balances = []
    Object.keys(resBalances).forEach(ticker => {
      const amount = resBalances[ticker]
      if (amount > 0) {
        balances.push(parseFloat(amount))
        nonZeroBalanceTickers.push(ticker)
      }
    })

    return {balances, nonZeroBalanceTickers}
  }

  async _getBalances ({secret, apiKey}) {
    const resBalances = await this._poloniexPrivateApiRequest('returnBalances', {}, apiKey, secret)
    const balances = []
    this.tickers.forEach(ticker => {
      const amount = resBalances[ticker]
      if (!amount) {
        throw new NotSupportedCurrencyError(`${ticker} is not supported`)
      }

      balances.push(parseFloat(amount))
      this.selectedCurrencies.push({name: ticker, ticker})
    })

    return balances
  }

  _sign (queryString, secret) {
    return crypto.createHmac('sha512', secret).update(queryString).digest('hex')
  }

  static getWalletIdentifierParameters () {
    return [{
      type: 'input',
      inputType: 'text',
      label: 'Poloniex Api Key',
      model: 'wallets.apiKey',
      autocomplete: 'off',
      required: true
    },
    {
      type: 'input',
      inputType: 'text',
      label: 'Poloniex secret',
      model: 'wallets.secret',
      autocomplete: 'off',
      required: true
    }]
  }
}

module.exports = ExchangePoloniex
