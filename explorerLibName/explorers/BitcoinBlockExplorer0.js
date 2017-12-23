const AbstractExplorer = require('./AbstractExplorer0')

const API_URL = 'https://blockexplorer.com/api'

class BitcoinBlockExplorer0 extends AbstractExplorer {
  constructor () {
    super()
    this.currencyName = 'Bitcoin'
    this.currencyTicker = 'BTC'
  }

  async _getBalance (address, result) {
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
    if (!this.tickers.includes('BTC')) return []

    let promises = []

    let result = {}
    if (this.elementsToFetch.includes('balances')) {
      promises.push(this._getBalance(this.addresses[0], result))
    }

    if (this.elementsToFetch.includes('transactions')) {
      promises.push(this._getTransactions(this.addresses[0], result))
    }

    await Promise.all(promises)

    return [result]
  }
}

module.exports = BitcoinBlockExplorer0
