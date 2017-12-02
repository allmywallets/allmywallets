import BitcoinBlockExplorer from './providers/BitcoinBlockExplorer'
import EthereumEtherscan from './providers/EthereumEtherscan'

const providers = {
  'bitcoin.blockexplorer': BitcoinBlockExplorer,
  'ethereum.etherscan': EthereumEtherscan
}

class Proxy {
  constructor (currency, provider, parameters) {
    const currencyProvider = `${currency}.${provider}`

    if (!Object.keys(providers).includes(currencyProvider)) {
      throw new Error(`Unsupported currency provider: ${currencyProvider}`)
    }

    return new providers[currencyProvider](parameters)
  }
}

export default Proxy
