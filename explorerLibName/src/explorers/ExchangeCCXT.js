const ccxt = require('ccxt')

const AbstractExchangeExplorer = require('./AbstractExchangeExplorer')
const NotSupportedCurrencyError = require('../errors/NotSupportedCurrencyError')

const ExchangeFactory = {
  getAvailableExchanges: () => {
    return ccxt.exchanges
  },

  getExchange: (exchangeName) => {
    /**
     * CCXT library exchange
     */
    class ExchangeCCXT extends AbstractExchangeExplorer {
      static get exchangeName () {
        return exchangeName
      }

      constructor (parameters) {
        super(parameters)
        this.exchange = ExchangeCCXT._instantiateCCXT()
      }

      static _setExchangeCredentials (exchange, {secret, apiKey}) {
        exchange.apiKey = apiKey
        exchange.secret = secret
      }

      static _instantiateCCXT () {
        const exchange = new ccxt[ExchangeCCXT.exchangeName]()

        // TODO
        // if (!exchange.hasCORS) {
        //   exchange.proxy = 'https://cors-anywhere.herokuapp.com/'
        // }

        exchange.proxy = 'https://cors-anywhere.herokuapp.com/'

        return exchange
      }

      static async getSupportedCurrencies () {
        const exchange = ExchangeCCXT._instantiateCCXT()

        const currenciesRes = await exchange.fetchMarkets()
        const currencies = {}
        currenciesRes.forEach(market => {
          currencies[market.base] = {name: market.base, ticker: market.base}
        })

        return currencies
      }

      async _checkApiKeyPermission ({secret, apiKey}) {
        // TODO
        return true
      }

      async _getAllNonZeroBalances (walletIdentifier) {
        ExchangeCCXT._setExchangeCredentials(this.exchange, walletIdentifier)
        const balancesRes = await this.exchange.fetchBalance()
        const balances = []
        const nonZeroBalanceTickers = []
        Object.keys(balancesRes.total).forEach(ticker => {
          const amount = balancesRes.total[ticker]
          if (amount === 0) return
          nonZeroBalanceTickers.push(ticker)
          balances.push(amount)
        })

        return {balances, nonZeroBalanceTickers}
      }

      async _getBalances (walletIdentifier) {
        ExchangeCCXT._setExchangeCredentials(this.exchange, walletIdentifier)
        const balancesRes = await this.exchange.fetchBalance()
        const balances = []
        this.tickers.forEach(ticker => {
          const amount = balancesRes.total[ticker]
          if (typeof amount === 'undefined') {
            throw new NotSupportedCurrencyError(`${ticker} is not supported`)
          }
          balances.push(amount)
        })

        return balances
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
    return ExchangeCCXT
  }
}

module.exports = ExchangeFactory
