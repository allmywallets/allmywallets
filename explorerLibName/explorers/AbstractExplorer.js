class AbstractExplorer {
  /**
   * Gets the balance given an address
   *
   * @returns {Promise<object>}
   */
  async getBalance (address) {
    throw new Error('This method should be implemented by child class')
  }

  /**
   * Gets the transactions given an address
   *
   * @returns {Promise<object>}
   */
  async getTransactions (address) {
    throw new Error('This method should be implemented by child class')
  }

  static async _fetchJson (url) {
    if (!AbstractExplorer._fetch) {
      AbstractExplorer._fetch = typeof window === 'undefined' ? require('node-fetch') : fetch
    }

    return AbstractExplorer._fetch(url).then((response) => response.json())
  }
}

module.exports = AbstractExplorer
