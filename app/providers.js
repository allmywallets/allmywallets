import Balance from './model/Balance'
import ExplorerLib from '../explorerLibName'
import Wallet from './model/Wallet'

export default class Proxy {
  constructor (wallet) {
    const walletObject = new Wallet(wallet.id, wallet.name, wallet.network, wallet.provider)
    const network = wallet.network
    const provider = wallet.provider
    const networkProvider = `${network}.${provider}`

    if (!ExplorerLib.list().includes(networkProvider)) {
      throw new Error(`Unsupported network provider: ${networkProvider}`)
    }

    const Provider = getGenericProviderClass(networkProvider)
    return new Provider(wallet.parameters, walletObject)
  }

  static getProviderParameters (provider) {
    return getGenericProviderClass(provider).getSupportedParameters()
  }

  static getProvidersList () {
    return ExplorerLib.list()
  }
}

function getGenericProviderClass (explorerName) {
  const Explorer = ExplorerLib.explorer(explorerName)
  class GenericProvider {
    constructor (parameters, wallet) {
      this.parameters = parameters
      this.explorer = new Explorer(this.parameters)
      this.wallet = wallet
    }

    async checkParameters () {
      await this.explorer.checkParameters()
      await this.explorer.checkAddresses(this.parameters.addresses)
      await this.explorer.checkWallets(this.parameters.wallets)
    }

    async getBalances (currencies = []) {
      this._selectCurrenciesToUpdate(this.explorer, currencies)
      if (this.parameters.addresses) {
        this.explorer.addresses(this.parameters.addresses)
      } else {
        this.explorer.wallets(this.parameters.wallets)
      }
      const wallets = await this.explorer
        .fetch(['balances'])
        .exec()

      const balances = []
      let walletIndex = 0
      wallets.forEach(wallet => {
        let i = 0
        this.explorer.getSelectedCurrencies().forEach(selectedCurrency => {
          const amount = wallet.balances[i]
          const address = this.parameters.addresses ? this.parameters.addresses[walletIndex] : 'exchangeDepositAddressWIP'
          const balance = new Balance(
            this.wallet,
            address,
            selectedCurrency.name,
            selectedCurrency.ticker,
            amount,
            new Date()
          )
          balances.push(balance)
          ++i
        })
        ++walletIndex
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
      let explorerParameters = Explorer.getExplorerParameters().map(param => {
        param.model = `explorerSpecific.${param.model}`
        return param
      })

      explorerParameters = explorerParameters.concat(Explorer.getWalletIdentifierParameters())

      const currencies = await Explorer.getSupportedCurrencies()
      explorerParameters.push({
        type: 'checklist',
        label: 'Currencies',
        model: 'currencies',
        multi: true,
        required: false,
        multiSelect: true,
        values: Object.keys(currencies)
      })

      return explorerParameters
    }
}

  return GenericProvider
}
