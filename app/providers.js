import GenericProvider from './providers/GenericProvider'
import EthereumEtherscan from './providers/EthereumEtherscanProvider'
import IOTA from './providers/IOTAProvider'

const providers = {
  'bitcoin.blockexplorer': GenericProvider('BitcoinBlockExplorer'),
  'bitcoin.mockexplorer': GenericProvider('MockExplorer'),
  'ethereum.etherscan': EthereumEtherscan,
  'iota.native': IOTA
}

export default class Proxy {
  constructor (network, provider, parameters) {
    const networkProvider = `${network}.${provider}`

    if (!Object.keys(providers).includes(networkProvider)) {
      throw new Error(`Unsupported network provider: ${networkProvider}`)
    }

    return new providers[networkProvider](parameters)
  }

  static getProvidersList () {
    return providers
  }
}
