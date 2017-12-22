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
    // TODO : require('node-fetch')
    return fetch(url).then((response) => response.json())
  }
}

module.exports = AbstractExplorer
