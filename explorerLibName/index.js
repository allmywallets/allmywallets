module.exports = {
  explorer: function (explorerName) {
    switch (explorerName) {
      case 'exchange.binance':
        return require('./explorers/Binance')
      case 'bitcoin.blockexplorer':
        return require('./explorers/BitcoinBlockExplorer')
      case 'ethereum.etherscan':
        return require('./explorers/EthereumEtherscan')
      case 'iota.native':
        return require('./explorers/IotaNative')
      case 'bitcoin.mockexplorer':
        return require('./explorers/MockExplorer')
      default:
        throw new Error(explorerName + ' explorer does not exist')
    }
  },
  list: function () {
    return ['exchange.binance', 'bitcoin.blockexplorer', 'ethereum.etherscan', 'iota.native', 'bitcoin.mockexplorer']
  }
}
