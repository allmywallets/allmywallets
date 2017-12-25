import Balance from '../model/Balance'
import Transaction from '../model/Transaction'
import AbstractProvider from './AbstractProvider'
import ExplorerLib from '../../explorerLibName'

export default function getGenericProviderClass (explorerName) {
  const Explorer = ExplorerLib.explorer(explorerName)
  class GenericProvider extends AbstractProvider {
    constructor (parameters) {
      super()
      this.parameters = parameters
      this.explorer = new Explorer(this.parameters.explorerSpecific)
    }

    async getWalletData (currencies = []) {
      this._selectCurrenciesToUpdate(this.explorer, currencies)
      const wallets = await this.explorer
        .addresses(this.parameters.addresses)
        .fetch(['balances', 'transactions'])
        .exec()

      const balances = []
      wallets.forEach(wallet => {
        let i = 0
        this.explorer.getSelectedCurrencies().forEach(selectedCurrency => {
          const amount = wallet.balances[i]
          const transactions = wallet.transactions[i].map(tx => new Transaction(tx.type, tx.from, tx.to, tx.amount))
          const balance = new Balance(selectedCurrency.name, selectedCurrency.ticker, amount, new Date(), transactions)
          balances.push(balance)
          ++i
        })
      })
      return balances
    }

    _selectCurrenciesToUpdate (explorer, currencies) {
      if (currencies.length === 0) { // Refresh all
        if (this.parameters.currencies) {
          explorer.currencies(this.parameters.currencies)
        }
      } else { // Refresh only specified
        explorer.currencies(currencies)
      }
    }

    static getSupportedParameters () {
      return [{
        type: 'input',
        inputType: 'text',
        label: `${this.explorer.defaultTicker} address`,
        model: 'address',
        required: true
      }]
    }
}

  return GenericProvider
}
