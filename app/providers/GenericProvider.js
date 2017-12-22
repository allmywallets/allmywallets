import Balance from '../model/Balance'
import Wallet from '../model/Wallet'
import AbstractProvider from './AbstractProvider'
import ExplorerLib from '../../explorerLibName'

export default function getGenericProviderClass (explorerName) {
  const Explorer = ExplorerLib.explorer(explorerName)
  const explorer = new Explorer()
  class GenericProvider extends AbstractProvider {
    constructor (parameters) {
      super()
      this.address = parameters.address
    }

    async getWalletData () {
      let promises = await Promise.all([
        explorer.getBalance(this.address),
        explorer.getTransactions(this.address)
      ])

      const balance = new Balance('Bitcoin', 'BTC', promises[0], [])

      return new Wallet([balance], new Date())
    }

    static getSupportedParameters () {
      return [{
        type: 'input',
        inputType: 'text',
        label: 'Bitcoin address',
        model: 'address',
        required: true
      }]
    }
}

  return GenericProvider
}
