module.exports = {
  explorer: function (explorerName) {
    switch (explorerName) {
      case 'exchange.binance':
        return require('./src/explorers/Binance')
      case 'bitcoin.blockexplorer':
        return require('./src/explorers/BitcoinBlockExplorer')
      case 'explorers.cryptoid':
        return require('./src/explorers/CryptoID')
      case 'ethereum.etherscan':
        return require('./src/explorers/EthereumEtherscan')
      case 'iota.native':
        return require('./src/explorers/IotaNative')
      case 'bitcoin.mockexplorer':
        return require('./src/explorers/MockExplorer')
      default:
        throw new Error(explorerName + ' explorer does not exist')
    }
  },
  list: function () {
    return ['exchange.binance', 'bitcoin.blockexplorer', 'explorers.cryptoid', 'ethereum.etherscan', 'iota.native', 'bitcoin.mockexplorer']
  }
}
