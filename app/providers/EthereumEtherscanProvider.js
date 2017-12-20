import Balance from '../model/Balance'
import Wallet from '../model/Wallet'
import Transaction from '../model/Transaction'
import AbstractProvider from './AbstractProvider'

const API_URL = 'https://api.etherscan.io/api'

export default class EthereumEtherscan extends AbstractProvider {
  constructor (parameters) {
    super()

    this.address = parameters.address
    this.apiKey = parameters.apiKey || ''
  }

  async getWalletData () {
    let rawBalance = await Promise.all([
      fetch(`${API_URL}?module=account&action=balance&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json()),
      fetch(`${API_URL}?module=account&action=txlist&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json())
    ])

    const balance = new Balance('Ethereum', 'eth', rawBalance[0].result / 1e18, this.parseTransactions(rawBalance[1].result))

    return new Wallet([balance], new Date())
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
