const AbstractExplorer = require('./AbstractExplorer')

class MockExplorer extends AbstractExplorer {
  static getSupportedCurrencies () {
    return {MOC: {name: 'MockCoin', ticker: 'MOC'}}
  }

  static getDefaultTicker () {
    return 'MOC'
  }

  async _getBalances (address) {
    return [42]
  }

  async _getTransactions (address) {
    return [[
      {timeStamp: '1513683799', id: '', from: 'fromAddress', to: 'toAddress', amount: 1, type: 'in'},
      {timeStamp: '1513253473', id: '', from: 'fromAddress', to: 'toAddress', amount: 1, type: 'out'}
    ]]
  }
}

module.exports = MockExplorer
