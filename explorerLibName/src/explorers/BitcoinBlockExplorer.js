const AbstractExplorer = require('./AbstractExplorer')

const API_URL = 'https://blockexplorer.com/api'

/**
 * Bitcoin blockchain explorer for https://blockexplorer.com/
 */
class BitcoinBlockExplorer extends AbstractExplorer {
  constructor () {
    super()

    this.supportedCurrencies = {BTC: {name: 'Bitcoin', ticker: 'BTC'}}
  }

  static getDefaultTicker () {
    return 'BTC'
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
}

module.exports = BitcoinBlockExplorer
