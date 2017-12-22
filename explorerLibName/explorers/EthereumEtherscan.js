const AbstractExplorer = require('./AbstractExplorer')
const ERC20Token = require('./ERC20Tokens.json')

const API_URL = 'https://api.etherscan.io/api'

class EthereumEtherscan extends AbstractExplorer {
  constructor () {
    super()
    this.currencyName = 'Ethereum'
    this.currencyTicker = 'ETH'
  }

  async getBalance (address) {
    const res = await this.constructor._fetchJson(`${API_URL}?module=account&action=balance&address=${address}&sort=desc&tag=latest`)
    return res.result / 1e18
  }

  async getTransactions (address) {
    const res = await this.constructor._fetchJson(`${API_URL}?module=account&action=txlist&address=${address}&sort=desc&tag=latest`)
    const transactions = res.result

    transactions.forEach(tx => {
      tx.type = tx.from === this.address ? 'out' : 'in'

      tx.id = tx.hash
      delete tx.hash

      tx.amount = tx.value
      delete tx.value
    })

    return transactions
  }

  async getTokenBalance (address, contractAddress, decimals) {
    const json = await this.constructor._fetchJson(`${API_URL}?module=account&action=tokenbalance&contractaddress=${contractAddress}
                                                            &address=${address}&tag=latest`)
    return json.result / decimals ? Math.pow(10, decimals) : 1e18
  }

  async getTokenBalanceByTicker (address, ticker, decimals) {
    const token = ERC20Token[ticker]
    if (!token) {
      console.err(`${ticker} not found`)
      return null
    }

    const json = await this.constructor._fetchJson(`${API_URL}?module=account&action=tokenbalance&contractaddress=${token.contractAddress}
                                                            &address=${address}&tag=latest`)
    return json.result / Math.pow(10, token.decimals)
  }
}

module.exports = EthereumEtherscan
