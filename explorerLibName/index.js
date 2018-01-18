const ExchangeCCXTFactory = require('./src/explorers/ExchangeCCXT')

module.exports = {
  explorer: function (explorerName) {
    switch (explorerName) {
      case 'binance.binance':
        return require('./src/explorers/ExchangeBinance')
      case 'bitcoin.blockexplorer':
        return require('./src/explorers/BitcoinBlockExplorer')
      case 'cryptoid.cryptoid':
        return require('./src/explorers/CryptoID')
      case 'ethereum.etherscan':
        return require('./src/explorers/EthereumEtherscan')
      case 'iota.native':
        return require('./src/explorers/IotaNative')
      case 'poloniex.poloniex':
        return require('./src/explorers/ExchangePoloniex')
      case 'bitcoin.mockexplorer':
        return require('./src/explorers/MockExplorer')
      default:
        const split = explorerName.split('.')
        if (split && split.length === 2 && split[0] === 'exchange') {
          const exchangeName = split[1]
          return ExchangeCCXTFactory.getExchange(exchangeName)
        }

        throw new Error(explorerName + ' explorer does not exist')
    }
  },
  list: function () {
    const providers = ['binance.binance', 'bitcoin.blockexplorer', 'cryptoid.cryptoid', 'ethereum.etherscan', 'iota.native', 'poloniex.poloniex', 'bitcoin.mockexplorer']
    return providers.concat(ExchangeCCXTFactory.getAvailableExchanges().map(exchangeName => 'exchange.' + exchangeName))
  }
}
