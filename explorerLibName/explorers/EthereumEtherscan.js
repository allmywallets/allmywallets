const AbstractExplorer = require('./AbstractExplorer')

const API_URL = 'https://api.etherscan.io/api'

class EthereumEtherscan extends AbstractExplorer {
  constructor (proxy) {
    super()
  }

  async getBalance (address) {
    const res = await this.constructor._fetchJson(`${API_URL}?module=account&action=balance&address=${address}&sort=desc&tag=latest`)
    return res.result / 1e18
  }

  async getTransactions (address) {
    const res = await this.constructor._fetchJson(`${API_URL}?module=account&action=txlist&address=${address}&sort=desc&tag=latest`)
    const transactions = res.result

    transactions.forEach(tx => {
      tx.id = tx.hash
      delete tx.hash

      tx.amount = tx.value
      delete tx.value
    })

    return transactions
  }
}

module.exports = EthereumEtherscan
