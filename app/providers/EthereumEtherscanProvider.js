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

    this.tokens = parameters.tokens
    this.customTokens = parameters.customTokens

    this.tokenList = {
      POWR: {
        name: 'Power Ledger',
        ticker: 'POWR',
        contractAdress: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
        decimals: 6
      },
      GNT: {
        name: 'Golem',
        ticker: 'GNT',
        contractAdress: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
        decimals: 18
      }
    }
  }

  async _getTokensBalances () {
    const promises = []
    this.tokens.forEach(tokenTicker => {
      const token = this.tokenList[tokenTicker]
      if (!token) {
        console.err(`${tokenTicker} not found`)
        return
      }

      promises.push(this._getTokenBalance(token))
    })

    return Promise.all(promises)
  }

  async _getTokenBalance (token) {
    const response = await fetch(`${API_URL}?module=account&action=tokenbalance&contractaddress=${token.contractAdress}&address=${this.address}&tag=latest`)
    const json = await response.json()
    return new Balance(token.name, token.ticker, json.result / Math.pow(10, token.decimals), [])
  }

  async getWalletData () {
    this._getTokensBalances()
    let promises = await Promise.all([
      fetch(`${API_URL}?module=account&action=balance&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json()),
      fetch(`${API_URL}?module=account&action=txlist&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json()),
      this._getTokensBalances()
    ])

    const ethereumBalance = new Balance('Ethereum', 'ETH', promises[0].result / 1e18, this.parseTransactions(promises[1].result))
    const tokenBalances = promises[2]
    const balances = tokenBalances
    balances.unshift(ethereumBalance)

    return new Wallet(balances, new Date())
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
      },
      tokens: {
        type: 'Array'
      },
      customTokens: {
        type: 'Array'
      }
    }
  }
}
