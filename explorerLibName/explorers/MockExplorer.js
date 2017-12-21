const AbstractExplorer = require('./AbstractExplorer')

class MockExplorer extends AbstractExplorer {
  async getBalance (address) {
    return 42
  }

  async getTransactions (address) {
    return [
      {timeStamp: '1513683799', id: '', from: 'fromAddress', to: 'toAddress', amount: 1},
      {timeStamp: '1513253473', id: '', from: 'fromAddress', to: 'toAddress', amount: 1}
    ]
  }
}

module.exports = MockExplorer
