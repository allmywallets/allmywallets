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
   * @param {Balance[]} balances
   * @returns {Promise}
   */
  async storeBalances (balances) {
    const db = await this.connection
    const tx = db.transaction('balance', 'readwrite')

    const txs = []
    balances.forEach(balance => {
      txs.push(tx.objectStore('balance').put(balance, balance.id))
    })

    return Promise.all(txs)
  }

  async findBalance (id) {
    const db = await this.connection

    const balance = await db.transaction('balance').objectStore('balance').get(id)

    if (balance === undefined) {
      throw new Error(`No such balance (${id})`)
    }

    return Balance.fromObject(balance)
  }

  async findBalances (ids) {
    const balancePromises = []

    ids.forEach(id => {
      balancePromises.push(this.findBalance(id))
    })

    return Promise.all(balancePromises)
  }

  async findAllBalances () {
    const db = await this.connection

    const balances = await db.transaction('balance').objectStore('balance').getAll()

    return balances.map(balance => Balance.fromObject(balance))
  }
}

export default new Database()
