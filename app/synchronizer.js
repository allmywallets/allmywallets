import idb from 'idb'
import Configurator from './configurator'
import Proxy from './providers'
import Wallet from './model/Wallet'

class Synchronizer {
  constructor () {
    this.connection = idb.open('wallet-store', 1, upgradeDB => {
      upgradeDB.createObjectStore('wallet')
    })
  }

  async sync (walletId) {
    const configuration = await Configurator.getConfiguration()
    const wallets = configuration.profiles[0].wallets

    if (walletId >= wallets.length) {
      return
    }

    const wallet = await new Proxy(
      wallets[walletId].network,
      wallets[walletId].provider,
      wallets[walletId].parameters
    ).getWalletData()

    const db = await this.connection
    const tx = db.transaction('wallet', 'readwrite')
    tx.objectStore('wallet').put(wallet, walletId)

    return tx.complete
  }

  async load (walletId) {
    const db = await this.connection

    const wallet = await db.transaction('wallet').objectStore('wallet').get(walletId)

    if (wallet === undefined) {
      throw new Error(`No such wallet (id: ${walletId})`)
    }

    return Wallet.fromObject(wallet)
  }
}

export default new Synchronizer()
