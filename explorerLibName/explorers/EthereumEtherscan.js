const AbstractExplorer = require('./AbstractExplorer')

if (typeof window === 'undefined') {
  fetch = require('node-fetch')
}

const API_URL = 'https://api.etherscan.io/api'

class EthereumEtherscan extends AbstractExplorer {
  constructor (proxy) {
    super()
  }

  async getBalance (address) {
    return fetch(`${API_URL}?module=account&action=balance&address=${address}&sort=desc&tag=latest`).then((response) => response.json())
  }

  async getTransactions (address) {
    return fetch(`${API_URL}?module=account&action=txlist&address=${address}&sort=desc&tag=latest`).then((response) => response.json())
  }
}

module.exports = EthereumEtherscan
