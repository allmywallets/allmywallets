import Wallet from '../model/Wallet'
import Transaction from '../model/Transaction'

const API_URL = 'http://api.etherscan.io/api'

export default class EthereumEtherscan {
  constructor (parameters) {
    this.name = parameters.name
    this.address = parameters.address
    this.apiKey = parameters.apiKey || ''
  }

  async getWalletData () {
    let wallet = await Promise.all([
      fetch(`${API_URL}?module=account&action=balance&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json()),
      fetch(`${API_URL}?module=account&action=txlist&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json())
    ])

    return new Wallet(
      this.name,
      'Ethereum',
      'eth',
      wallet[0].result / 1e18,
      this.parseTransactions(wallet[1].result)
    )
  }

  parseTransactions (rawTransactions) {
    const transactions = []

    rawTransactions.forEach((transaction) => {
      transactions.push(
        new Transaction(
          transaction.from === this.address ? 'out' : 'in',
          transaction.from,
          transaction.to,
          transaction.value / 1e18
        )
      )
    })

    return transactions
  }

  getParametersList () {
    return {
      address: {
        type: String
      }
    }
  }
}
