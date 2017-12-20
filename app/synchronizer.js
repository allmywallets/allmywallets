import idbKeyval from 'idb-keyval'
import Configurator from './configurator'
import Proxy from './providers'
import Wallet from './model/Wallet'

export default class Synchronizer {
  static async sync (walletId) {
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

    // todo: replace with dedicated db
    return idbKeyval.set(`wallet-${walletId}`, wallet)
  }

  static async load (walletId) {
    // todo: replace with dedicated db
    const wallet = await idbKeyval.get(`wallet-${walletId}`)

    if (wallet === undefined) {
      return null
    }

    return Wallet.fromObject(wallet)
  }

  static async lastUpdate () {
    return idbKeyval.get('lastUpdate')
  }
}
