const AbstractExplorer = require('./AbstractExplorer')

class MockExplorer extends AbstractExplorer {
  constructor () {
    super()

    this.defaultTicker = 'MOC'
    this.supportedCurrencies = {MOC: {name: 'MockCoin', ticker: 'MOC'}}
  }

  async _getBalances (address, result) {
    result.balances = [42]
    return Promise.resolve()
  }

  async _getTransactions (address, result) {
    result.transactions = [[
      {timeStamp: '1513683799', id: '', from: 'fromAddress', to: 'toAddress', amount: 1, type: 'in'},
      {timeStamp: '1513253473', id: '', from: 'fromAddress', to: 'toAddress', amount: 1, type: 'out'}
    ]]

    return Promise.resolve()
  }
}

module.exports = MockExplorer
