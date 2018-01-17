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
        this.exchange = new ccxt[exchangeName]()
        if (!this.exchange.hasCORS) {
          this.exchange.proxy = 'https://cors-anywhere.herokuapp.com/'
        }
      }

      static setExchangeCredentials (exchange, {secret, apiKey}) {
        exchange.apiKey = apiKey
        exchange.secret = secret
      }

      static async getSupportedCurrencies () {
        const exchange = new ccxt[exchangeName]()
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
        this.constructor.setExchangeCredentials(this.exchange, walletIdentifier)
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
        this.constructor.setExchangeCredentials(this.exchange, walletIdentifier)
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
