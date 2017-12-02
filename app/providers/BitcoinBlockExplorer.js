import Wallet from '../model/Wallet'

const API_URL = 'https://blockexplorer.com/api'

export default class BitcoinBlockExplorer {
  constructor (parameters) {
    this.name = parameters.name
    this.address = parameters.address
  }

  async getWalletData () {
    let wallet = await Promise.all([
      fetch(`${API_URL}/addr/${this.address}/balance`).then((response) => response.json()),
      fetch(`${API_URL}/txs/?address=${this.address}`).then((response) => response.json())
    ])

    return new Wallet(
      this.name,
      'Bitcoin',
      'btc',
      wallet[0] / 1e8,
      []
    )
  }

  getParametersList () {
    return {
      address: {
        type: String
      }
    }
  }
}
