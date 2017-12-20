import Balance from '../model/Balance'
import Wallet from '../model/Wallet'
import Transaction from '../model/Transaction'
import AbstractProvider from './AbstractProvider'
import ERC20Token from './ERC20Tokens.json'

const API_URL = 'https://api.etherscan.io/api'

export default class EthereumEtherscan extends AbstractProvider {
  constructor (parameters) {
    super()

    this.address = parameters.address
    this.apiKey = parameters.apiKey || ''

    this.tokens = parameters.tokens || []
    this.customTokens = parameters.customTokens || []
  }

  async _getTokensBalances () {
    const promises = []
    this.tokens.forEach(tokenTicker => {
      const token = ERC20Token[tokenTicker]
      if (!token) {
        console.err(`${tokenTicker} not found`)
        return
      }

      promises.push(this._getTokenBalance(token))
    })
    this.customTokens.forEach(token => {
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
    let promises = await Promise.all([
      fetch(`${API_URL}?module=account&action=balance&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json()),
      fetch(`${API_URL}?module=account&action=txlist&address=${this.address}&sort=desc&tag=latest`).then((response) => response.json()),
      this._getTokensBalances()
    ])

    const ethereumBalance = new Balance('Ethereum', 'ETH', promises[0].result / 1e18, this._parseTransactions(promises[1].result))
    const tokenBalances = promises[2]
    const balances = tokenBalances
    balances.unshift(ethereumBalance)

    return new Wallet(balances, new Date())
  }

  _parseTransactions (rawTransactions) {
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
