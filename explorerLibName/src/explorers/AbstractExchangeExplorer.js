const AbstractExplorer = require('./AbstractExplorer')
const ApiKeyPermissionError = require('../errors/ApiKeyPermissionError')
const OnlyEmptyBalancesFound = require('../errors/OnlyEmptyBalancesFound')

/**
 * AbstractExchangeExplorer
 */
class AbstractExchangeExplorer extends AbstractExplorer {
  constructor () {
    super()

    this.selectedCurrencies = []
    this.supportedCurrencies = {BTC: {name: 'Bitcoin', ticker: 'BTC'}}
  }

  static async getSupportedCurrencies () {
    throw new Error('This method should be implemented by child class')
  }

  static get isExchange () {
    return true
  }

  static get dynamicSupportedCurrencies () {
    return true
  }

  static getDefaultTicker () {
    return 'DEFAULT_TICKER'
  }

  getSelectedCurrencies () {
    return this.selectedCurrencies
  }

  async checkWallets (wallets) {
    wallets.forEach(async wallet => {
      const correctPermission = await this._checkApiKeyPermission(wallet)
      if (!correctPermission) { throw new ApiKeyPermissionError('API Key permission error') }
    })
  }

  /**
   * Return true if the permission is correct false otherwise
   * @returns {boolean}
   */
  async _checkApiKeyPermission (walletIdentifier) {
    throw new Error('This method should be implemented by child class')
  }

  async _getTransactions (walletIdentifier, nonZeroBalanceTickers) {
    if (this.tickers.length !== 0) {
      return this._fetchTransactions(walletIdentifier, this.tickers)
    }

    if (nonZeroBalanceTickers) {
      return this._fetchTransactions(walletIdentifier, nonZeroBalanceTickers)
    }

    return [[]]
  }

  async _fetchTransactions (walletIdentifier, tickers) {
    const transactions = []
    tickers.forEach(ticker => {
      transactions.push([])
    })

    return transactions
  }

  async _getAllNonZeroBalances (walletIdentifier, wallet) {
    throw new Error('This method should be implemented by child class')
  }

  async _setAllNonZeroBalancesTransactionsWallet (walletIdentifier, wallet) {
    const {balances, nonZeroBalanceTickers} = await this._getAllNonZeroBalances(walletIdentifier)

    if (balances.length === 0) {
      throw new OnlyEmptyBalancesFound('Only empty balances found')
    }

    nonZeroBalanceTickers.forEach(ticker => {
      this.selectedCurrencies.push({name: ticker, ticker})
    })
    wallet.balances = balances

    if (this.elementsToFetch.includes('transactions')) {
      const transactions = await this._getTransactions(walletIdentifier, nonZeroBalanceTickers)
      wallet.transactions = transactions
    }

    if (this.elementsToFetch.includes('addresses')) {
      const addresses = await this._getAddresses(walletIdentifier, nonZeroBalanceTickers)
      wallet.addresses = addresses
    }
  }

  async exec () {
    if (this.tickers.length === 0) {
      let promises = []
      let wallets = []
      this._addresses.forEach(walletIdentifier => {
        const wallet = {}
        promises.push(this._setAllNonZeroBalancesTransactionsWallet(walletIdentifier, wallet))
        wallets.push(wallet)
      })

      await Promise.all(promises)

      return wallets
    }

    this.selectedCurrencies = this.tickers.map(ticker => { return { name: ticker, ticker } })
    return super.exec()
  }
}

module.exports = AbstractExchangeExplorer
