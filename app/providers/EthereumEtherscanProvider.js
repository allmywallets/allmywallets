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
    const contractAdress = '0x595832f8fc6bf59c85c527fec3740a1b7a361269'
    const decimals = 6
    let rawBalance = await Promise.all([
      fetch(`${API_URL}?module=account&action=balance&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json()),
      fetch(`${API_URL}?module=account&action=txlist&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json()),
      fetch(`${API_URL}?module=account&action=tokenbalance&contractaddress=${contractAdress}&address=${this.address}&tag=latest`).then((response) => response.json())
    ])

    const balance = new Balance('Ethereum', 'ETH', rawBalance[0].result / 1e18, this.parseTransactions(rawBalance[1].result))

    const balance2 = new Balance('Power Ledger', 'POWR', rawBalance[2].result / Math.pow(10, decimals), [])

    return new Wallet([balance, balance2], new Date())
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
