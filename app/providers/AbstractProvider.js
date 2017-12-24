export default class AbstractProvider {
  /**
   * Gets a wallet with up to date balances.
   *
   * @param {String[]} currencies
   *
   * @returns {Promise<object>}
   */
  async getWalletData (currencies = []) {
    throw new Error('This method should be implemented by child class')
  }

  static getSupportedParameters () {
    throw new Error('This method should be implemented by child class')
  }
}
