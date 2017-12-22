module.exports = {
  explorer: function (explorerName) {
    switch (explorerName) {
      case 'BitcoinBlockExplorer':
        return require('./explorers/BitcoinBlockExplorer')
      case 'EthereumEtherscan':
        return require('./explorers/EthereumEtherscan')
      case 'IOTA':
        return require('./explorers/EthereumEtherscan') // TODO
      case 'MockExplorer':
        return require('./explorers/MockExplorer')
      default:
        throw new Error(explorerName + ' does not exist')
    }
  },
  list: function () {
    return ['MockExplorer', 'BitcoinBlockExplorer', 'EthereumEtherscan']
  }
}
