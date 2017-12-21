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
}

module.exports = AbstractExplorer
