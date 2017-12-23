import idb from 'idb'
import Balance from './model/Balance'

class Database {
  constructor () {
    this.connection = idb.open('balance-store', 1, upgradeDB => {
      upgradeDB.createObjectStore('balance')
    })
  }

  /**
   * Saves a wallet in the object store.
   *
   * @param {array} balances
   * @param {number} walletId
   * @returns {Promise}
   */
  async saveBalances (balances, walletId) {
    const db = await this.connection
    const tx = db.transaction('balance', 'readwrite')

    const txs = []
    balances.forEach((balance, id) => {
      txs.push(tx.objectStore('balance').put(balance, `${walletId}.${id}`))
    })

    return Promise.all(txs)
  }

  async getBalance (balanceId) {
    const db = await this.connection

    const balance = await db.transaction('balance').objectStore('balance').get(balanceId)

    if (balance === undefined) {
      throw new Error(`No such balance (id: ${balanceId})`)
    }

    return Balance.fromObject(balance)
  }

  async getBalances () {
    const db = await this.connection

    const keys = db.transaction('balance').objectStore('balance').getAllKeys()
    const balances = db.transaction('balance').objectStore('balance').getAll()

    return Promise.all([keys, balances]).then(([keys, balances]) => {
      return keys.map((val, index) => {
        return { key: val, value: balances[index] }
      })
    })
  }
}

export default new Database()
