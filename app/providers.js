import Balance from './model/Balance'
import Transaction from './model/Transaction'
import ExplorerLib from '../explorerLibName'

export default class Proxy {
  constructor (network, provider, parameters) {
    const networkProvider = `${network}.${provider}`

    if (!ExplorerLib.list().includes(networkProvider)) {
      throw new Error(`Unsupported network provider: ${networkProvider}`)
    }

    const Provider = getGenericProviderClass(networkProvider)
    return new Provider(parameters)
  }

  static getProviderParams (provider) {
    return getGenericProviderClass(provider).getSupportedParameters()
  }

  static getProvidersList () {
    return ExplorerLib.list()
  }
}

function getGenericProviderClass (explorerName) {
  const Explorer = ExplorerLib.explorer(explorerName)
  class GenericProvider {
    constructor (parameters) {
      this.parameters = parameters
      this.explorer = new Explorer(this.parameters.explorerSpecific)
    }

    async checkArgs (parameters) {
      await this.explorer.checkArgs()
      await this.explorer.checkAddresses(parameters.addresses)
      await this.explorer.checkWallets(parameters.wallets)
    }

    async getWalletData (currencies = []) {
      this._selectCurrenciesToUpdate(this.explorer, currencies)
      if (this.parameters.addresses) {
        this.explorer.addresses(this.parameters.addresses)
      } else {
        this.explorer.wallets(this.parameters.wallets)
      }
      const wallets = await this.explorer
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

    static async getSupportedParameters () {
      let explorerParams = Explorer.getExplorerParams().map(param => {
        param.model = `explorerSpecific.${param.model}`
        return param
      })

      explorerParams = explorerParams.concat(Explorer.getAddressParam())

      const currencies = await Explorer.getSupportedCurrencies()
      explorerParams.push({
        type: 'checklist',
        label: 'Currencies',
        model: 'currencies',
        multi: true,
        required: false,
        multiSelect: true,
        values: Object.keys(currencies)
      })

      return explorerParams
    }
}

  return GenericProvider
}
