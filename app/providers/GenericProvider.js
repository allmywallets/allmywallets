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
      this.parameters = parameters
    }

    async getWalletData () {
      const res = await explorer
          .address(this.parameters.address)
          .currencies(this.parameters.currencies)
          .fetch(['balances', 'transactions'])
          .exec()

      const balances = []
      this.parameters.currencies.forEach(currency => {
        const amount = res[0].balances[0]
        const transactions = res[0].transactions[0].map(tx => new Transaction(tx.type, tx.from, tx.to, tx.amount))
        const balance = new Balance(currency, currency, amount, new Date(), transactions)
        balances.push(balance)
      })

      return balances
    }

    static getSupportedParameters () {
      return [{
        type: 'input',
        inputType: 'text',
        label: `BTC address`, // TODO : hardcoded
        model: 'address',
        required: true
      }]
    }
}

  return GenericProvider
}
