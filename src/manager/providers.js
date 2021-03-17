import Balance from "../model/Balance"
import Providers from "@allmywallets/providers"
import Wallet from "../model/Wallet"

const AMW_PROXY_URL =
  process.env.NODE_ENV === "production"
    ? "https://cors.allmywallets.io/"
    : "https://cors-anywhere.herokuapp.com/"

export default class Proxy {
  constructor(wallet) {
    const walletObject = new Wallet(
      wallet.id,
      wallet.name,
      wallet.network,
      wallet.provider
    )
    const network = wallet.network
    const provider = wallet.provider
    const networkProvider = `${network}.${provider}`

    if (!Providers.list().includes(networkProvider)) {
      throw new Error(`Unsupported network provider: ${networkProvider}`)
    }

    const Provider = getGenericProviderClass(networkProvider)
    return new Provider(wallet.parameters, walletObject)
  }

  static getProviderParameters(provider) {
    return getGenericProviderClass(provider).getSupportedParameters()
  }

  static getProvidersList() {
    return Providers.list().map(provider => {
      const info = Providers.providers[provider].info
      info.warnings = {
        cors: !info.hasCORS,
        apiKey:
          typeof info.apiKeyPermission !== "undefined" && !info.apiKeyPermission
      }
      delete info.hasCORS
      delete info.apiKeyPermission
      return info
    })
  }
}

function wrapDefiProvider(Provider) {
  // Fix web3 related error: Uncaught TypeError: Cannot read property 'node' of undefined
  // https://github.com/ChainSafe/web3.js/issues/1986
  process.versions = { node: "11.2.0" }

  class DeFiProvider {
    constructor(parameters, wallet) {
      this.parameters = parameters
      this.defi = new Provider(this.parameters)
      this.defi.setProxy(Provider.info.hasCORS ? "" : AMW_PROXY_URL)
      this.wallet = wallet
    }

    async checkParameters() {
      await this.defi.checkParameters()
      await this.defi.checkAddresses(this.parameters.address)
      await this.defi.checkWallets(this.parameters.wallet)
    }

    async getBalances() {
      const balances = []

      const platforms = this.parameters.platforms
      const platformPools = await this.defi
        .address(this.parameters.address)
        .platforms(platforms)
        .exec()

      platformPools.forEach((platformPool, i) => {
        platformPool.forEach(pool => {
          const balance = new Balance(
            this.wallet,
            this.parameters.address,
            platforms[i],
            "LP " + Object.keys(pool.tokens).join(),
            pool.lpTokenAmount,
            new Date()
          )
          balances.push(balance)
        })
      })

      return balances
    }

    static async getSupportedParameters() {
      let providerParameters = Provider.getProviderParameters().map(param => {
        param.model = `providerSpecific.${param.model}`
        return param
      })

      providerParameters = providerParameters.concat(
        Provider.getWalletIdentifierParameters()
      )

      providerParameters.push({
        type: "checklist",
        label: "DeFi platforms",
        model: "platforms",
        multi: true,
        required: false,
        multiSelect: true,
        values: new Provider().availablePlatforms()
      })

      return providerParameters
    }
  }

  return DeFiProvider
}

function getGenericProviderClass(providerName) {
  const Provider = Providers.providers[providerName]

  if (Provider.isDeFi) {
    return wrapDefiProvider(Provider)
  }

  class GenericProvider {
    constructor(parameters, wallet) {
      this.parameters = parameters
      this.provider = new Provider(this.parameters)
      this.provider.setProxy(Provider.info.hasCORS ? "" : AMW_PROXY_URL)
      this.wallet = wallet
    }

    async checkParameters() {
      await this.provider.checkParameters()
      await this.provider.checkAddresses(this.parameters.addresses)
      await this.provider.checkWallets(this.parameters.wallets)
    }

    async getBalances(currencies = []) {
      this._selectCurrenciesToUpdate(this.provider, currencies)
      if (this.parameters.addresses) {
        this.provider.addresses(this.parameters.addresses)
      } else {
        this.provider.wallets(this.parameters.wallets)
      }
      const wallets = await this.provider
        .fetch(["balances", "addresses"])
        .exec()

      const balances = []
      wallets.forEach(wallet => {
        let i = 0
        this.provider.getSelectedCurrencies().forEach(selectedCurrency => {
          const amount = wallet.balances[i]
          const address = wallet.addresses[i] || ""
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

    _selectCurrenciesToUpdate(provider, currencies) {
      if (currencies.length === 0) {
        // Refresh all
        if (this.parameters.currencies) {
          provider.currencies(this.parameters.currencies)
        }
      } else {
        // Refresh only specified
        provider.currencies(currencies)
      }
    }

    static async _getSupportedTickers() {
      let supportedTickers = []
      try {
        const provider = new Provider()
        provider.setProxy(Provider.info.hasCORS ? "" : AMW_PROXY_URL)
        const currencies = await provider.getSupportedCurrencies()
        supportedTickers = Object.keys(currencies)
        // eslint-disable-next-line no-empty
      } catch (e) {} // Provider needs credentials to retrieve tickers

      return supportedTickers
    }

    static async getSupportedParameters() {
      let providerParameters = Provider.getProviderParameters().map(param => {
        param.model = `providerSpecific.${param.model}`
        return param
      })

      providerParameters = providerParameters.concat(
        Provider.getWalletIdentifierParameters()
      )

      providerParameters.push({
        type: "checklist",
        label: "Currencies",
        model: "currencies",
        multi: true,
        required: true,
        multiSelect: true,
        values: await GenericProvider._getSupportedTickers()
      })

      return providerParameters
    }
  }

  return GenericProvider
}
