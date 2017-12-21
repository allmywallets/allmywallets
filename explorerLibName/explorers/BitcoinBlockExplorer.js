const AbstractExplorer = require('./AbstractExplorer')

if (typeof window === 'undefined') {
  fetch = require('node-fetch')
}

const API_URL = 'https://blockexplorer.com/api'

class BitcoinBlockExplorer extends AbstractExplorer {
  constructor (proxy) {
    super()
  }

  async getBalance (address) {
    return fetch(`${API_URL}/addr/${address}/balance`).then((response) => response.json())
  }

  async getTransactions (address) {
    return fetch(`${API_URL}/txs/?address=${address}`).then((response) => response.json())
  }
}

module.exports = BitcoinBlockExplorer
