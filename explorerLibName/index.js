module.exports = {
  explorer: function (explorerName) {
    switch (explorerName) {
      case 'Binance':
        return require('./explorers/Binance')
      case 'BitcoinBlockExplorer':
        return require('./explorers/BitcoinBlockExplorer')
      case 'EthereumEtherscan':
        return require('./explorers/EthereumEtherscan')
      case 'IOTA':
        return require('./explorers/IotaNative')
      case 'MockExplorer':
        return require('./explorers/MockExplorer')
      default:
        throw new Error(explorerName + ' explorer does not exist')
    }
  },
  list: function () {
    return ['Binance', 'BitcoinBlockExplorer', 'EthereumEtherscan', 'IOTA', 'MockExplorer']
  }
}
