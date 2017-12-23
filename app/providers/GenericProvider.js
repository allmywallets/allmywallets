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
      if (this.parameters.currencies) {
        explorer.currencies(this.parameters.currencies)
      }

      const wallets = await explorer
          .addresses(this.parameters.addresses)
          .fetch(['balances', 'transactions'])
          .exec()

      const balances = []
      wallets.forEach(wallet => {
        for (let i = 0; i < explorer.tickers.length; i++) {
          console.log(wallet)
          const amount = wallet.balances[0]
          const transactions = wallet.transactions[0].map(tx => new Transaction(tx.type, tx.from, tx.to, tx.amount))
          const balance = new Balance(explorer.tickers[i], explorer.tickers[i], amount, new Date(), transactions)
          balances.push(balance)
        }
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
