import Balance from '../model/Balance'
import Wallet from '../model/Wallet'
import AbstractProvider from './AbstractProvider'

const API_URL = 'https://blockexplorer.com/api'

export default class BitcoinBlockExplorerProvider extends AbstractProvider {
  constructor (parameters) {
    super()

    this.name = parameters.name
    this.address = parameters.address
  }

  async getWalletData () {
    let rawBalance = await Promise.all([
      fetch(`${API_URL}/addr/${this.address}/balance`).then((response) => response.json()),
      fetch(`${API_URL}/txs/?address=${this.address}`).then((response) => response.json())
    ])

    const balance = new Balance('Bitcoin', 'btc', rawBalance[0] / 1e8, [])

    return new Wallet(this.name, [balance], new Date())
  }

  getParametersList () {
    return {
      address: {
        type: String
      }
    }
  }
}
