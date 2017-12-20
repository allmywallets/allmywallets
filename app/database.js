import idb from 'idb'
import Wallet from './model/Wallet'

class Database {
  constructor () {
    this.connection = idb.open('wallet-store', 1, upgradeDB => {
      upgradeDB.createObjectStore('wallet')
    })
  }

  /**
   * Saves a wallet in the object store.
   *
   * @param walletId
   * @param {Wallet} wallet
   * @returns {Promise}
   */
  async saveWallet (walletId, wallet) {
    const db = await this.connection
    const tx = db.transaction('wallet', 'readwrite')

    return tx.objectStore('wallet').put(wallet, walletId)
  }

  async getWallet (walletId) {
    const db = await this.connection

    const wallet = await db.transaction('wallet').objectStore('wallet').get(walletId)

    if (wallet === undefined) {
      throw new Error(`No such wallet (id: ${walletId})`)
    }

    return Wallet.fromObject(wallet)
  }
}

export default new Database()
