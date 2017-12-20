export default class AbstractProvider {
  /**
   * Gets a wallet with up to date balances.
   *
   * @returns {Promise<object>}
   */
  async getWalletData () {
    throw new Error('This method should be implemented by child class')
  }

  getConfiguration () {
    throw new Error('This method should be implemented by child class')
  }
}
