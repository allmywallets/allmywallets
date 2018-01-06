const AbstractExplorer = require('./AbstractExplorer')
const ApiKeyPermissionError = require('../errors/ApiKeyPermissionError')

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
      if (!correctPermission) { throw new ApiKeyPermissionError() }
    })
  }

  /**
   * Return true if the permission is correct false otherwise
   * @returns {boolean}
   */
  async _checkApiKeyPermission ({secret, apiKey}) {
    throw new Error('This method should be implemented by child class')
  }

  async _getBalances (walletIdentifier, wallet) {
    this.selectedCurrencies = []
    wallet.balances = []

    if (this.tickers[0] === 'DEFAULT_TICKER') {
      return this._getAllNonZeroBalances(walletIdentifier, wallet)
    }
    return this._getSpecifiedBalances(walletIdentifier, wallet)
  }

  async _getAllNonZeroBalances (walletIdentifier, wallet) {
    throw new Error('This method should be implemented by child class')
  }

  async _getSpecifiedBalances (walletIdentifier, wallet) {
    throw new Error('This method should be implemented by child class')
  }
}

module.exports = AbstractExchangeExplorer
