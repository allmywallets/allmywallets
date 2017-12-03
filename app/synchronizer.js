import idbKeyval from 'idb-keyval'
import Configurator from './configurator'
import Proxy from './providers'
import Wallet from './model/Wallet'

export default class Synchronizer {
  static async sync () {
    const configuration = await Configurator.getConfiguration()

    const wallets = []
    for (const wallet of configuration.profiles[0].wallets) {
      try {
        wallets.push(await new Proxy(wallet.currency, wallet.provider, wallet.parameters).getWalletData())
      } catch (e) {}
    }

    return Promise.all([
      idbKeyval.set('wallets', wallets),
      idbKeyval.set('lastUpdate', new Date())
    ])
  }

  static async load () {
    const wallets = idbKeyval.get('wallets')

    if (wallets === null) {
      return []
    }

    return wallets.then((wallets) => wallets.map(wallet => Wallet.fromObject(wallet)))
  }

  static async lastUpdate () {
    return idbKeyval.get('lastUpdate')
  }
}
