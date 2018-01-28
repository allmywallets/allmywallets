import Balance from './model/Balance'
import Providers from '@allmywallets/providers'
import Wallet from './model/Wallet'

const AMW_PROXY_URL = 'https://cors-anywhere.herokuapp.com/'

export default class Proxy {
  constructor (wallet) {
    const walletObject = new Wallet(wallet.id, wallet.name, wallet.network, wallet.provider)
    const network = wallet.network
    const provider = wallet.provider
    const networkProvider = `${network}.${provider}`

    if (!Providers.list().includes(networkProvider)) {
      throw new Error(`Unsupported network provider: ${networkProvider}`)
    }

    const Provider = getGenericProviderClass(networkProvider)
    return new Provider(wallet.parameters, walletObject)
  }

  static getProviderParameters (provider) {
    return getGenericProviderClass(provider).getSupportedParameters()
  }

  static getProvidersList () {
    return Providers.list().map(provider => Providers.providers[provider].info)
  }
}

function getGenericProviderClass (explorerName) {
  const Explorer = Providers.providers[explorerName]
  class GenericProvider {
    constructor (parameters, wallet) {
      this.parameters = parameters
      this.explorer = new Explorer(this.parameters)
      this.explorer.setProxy(Explorer.info.hasCORS ? '' : AMW_PROXY_URL)
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
        .fetch(['balances', 'addresses'])
        .exec()

      const balances = []
      wallets.forEach(wallet => {
        let i = 0
        this.explorer.getSelectedCurrencies().forEach(selectedCurrency => {
          const amount = wallet.balances[i]
          const address = wallet.addresses[i]
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

      const explorer = new Explorer()
      explorer.setProxy(Explorer.info.hasCORS ? '' : AMW_PROXY_URL)
      const currencies = await explorer.getSupportedCurrencies()
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
