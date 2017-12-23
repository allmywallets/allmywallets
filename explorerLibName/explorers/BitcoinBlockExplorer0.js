const AbstractExplorer = require('./AbstractExplorer0')

const API_URL = 'https://blockexplorer.com/api'

class BitcoinBlockExplorer0 extends AbstractExplorer {
  constructor () {
    super()
    this.currencyName = 'Bitcoin'
    this.supportedTickers = ['BTC']
  }

  async _getBalances (address, result) {
    let btcBalance = await this.constructor._fetchJson(`${API_URL}/addr/${address}/balance`).then(amount => amount / 1e8)
    result.balances = [btcBalance]
  }

  async _getTransactions (address, result) {
    const res = await this.constructor._fetchJson(`${API_URL}/txs/?address=${address}`)
    const transactions = res.txs

    transactions.forEach(tx => {
      tx.timeStamp = tx.time
      delete tx.time

      tx.id = tx.txid
      delete tx.txid

      tx.vin.forEach(vin => {
        if (vin.addr === address) {
          tx.type = 'out'
          tx.from = address
          tx.to = '?'
          tx.amount = vin.value
          return false
        }
      })

      tx.vout.forEach(vout => {
        if (vout.scriptPubKey.addresses[0] === address) {
          tx.type = 'in'
          tx.from = '?'
          tx.to = address
          tx.amount = vout.value
          return false
        }
      })
    })

    result.transactions = [transactions]
  }

  async exec () {
    let promises = []
    let wallets = []

    this.addresses.forEach(address => {
      const wallet = {}
      if (this.elementsToFetch.includes('balances')) {
        promises.push(this._getBalances(address, wallet))
      }

      if (this.elementsToFetch.includes('transactions')) {
        promises.push(this._getTransactions(address, wallet))
      }

      wallets.push(wallet)
    })

    await Promise.all(promises)

    return wallets
  }
}

module.exports = BitcoinBlockExplorer0
