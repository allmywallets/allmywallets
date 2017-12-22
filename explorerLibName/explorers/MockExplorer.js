const AbstractExplorer = require('./AbstractExplorer')

class MockExplorer extends AbstractExplorer {
  constructor () {
    super()
    this.currencyName = 'Mock'
    this.currencyTicker = 'MOC'
  }

  async getBalance (address) {
    return 42
  }

  async getTransactions (address) {
    return [
      {timeStamp: '1513683799', id: '', from: 'fromAddress', to: 'toAddress', amount: 1, type: 'in'},
      {timeStamp: '1513253473', id: '', from: 'fromAddress', to: 'toAddress', amount: 1, type: 'out'}
    ]
  }
}

module.exports = MockExplorer
