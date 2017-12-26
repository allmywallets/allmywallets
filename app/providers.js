import Balance from './model/Balance'
import Transaction from './model/Transaction'
import ExplorerLib from '../explorerLibName'

const providers = {
  'bitcoin.blockexplorer': 'BitcoinBlockExplorer',
  'bitcoin.mockexplorer': 'MockExplorer',
  'ethereum.etherscan': 'EthereumEtherscan',
  'iota.native': 'IOTA',
  'exchange.binance': 'Binance'
}

export default class Proxy {
  constructor (network, provider, parameters) {
    const networkProvider = `${network}.${provider}`

    if (!Object.keys(providers).includes(networkProvider)) {
      throw new Error(`Unsupported network provider: ${networkProvider}`)
    }

    const Provider = getGenericProviderClass(providers[networkProvider])
    return new Provider(parameters)
  }

  static getProviderParams (provider) {
    return getGenericProviderClass(providers[provider]).getSupportedParameters()
  }

  static getProvidersList () {
    return providers
  }
}

function getGenericProviderClass (explorerName) {
  const Explorer = ExplorerLib.explorer(explorerName)
  class GenericProvider {
    constructor (parameters) {
      this.parameters = parameters
      this.explorer = new Explorer(this.parameters.explorerSpecific)
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

    static getSupportedParameters () {
      const explorerParams = Explorer.getExplorerParams().map(param => {
        param.model = `explorerSpecific.${param.model}`
        return param
      })
      return explorerParams.concat(Explorer.getAddressParam())
    }
}

  return GenericProvider
}
