import Balance from '../model/Balance'
import Transaction from '../model/Transaction'
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

      const amount = promises[0]
      const transactions = promises[1].map(tx => new Transaction(tx.type, tx.from, tx.to, tx.amount))
      const balance = new Balance(explorer.currencyName, explorer.currencyTicker, amount, new Date(), transactions)

      return [balance]
    }

    static getSupportedParameters () {
      return [{
        type: 'input',
        inputType: 'text',
        label: `${explorer.currencyName} address`,
        model: 'address',
        required: true
      }]
    }
}

  return GenericProvider
}
