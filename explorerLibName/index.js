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
      case 'bitcoin.mockexplorer':
        return require('./src/explorers/MockExplorer')
      default:
        throw new Error(explorerName + ' explorer does not exist')
    }
  },
  list: function () {
    return ['binance.binance', 'bitcoin.blockexplorer', 'cryptoid.cryptoid', 'ethereum.etherscan', 'iota.native', 'bitcoin.mockexplorer']
  }
}
