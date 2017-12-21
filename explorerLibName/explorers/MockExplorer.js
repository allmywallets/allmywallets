const AbstractExplorer = require('./AbstractExplorer')

class MockExplorer extends AbstractExplorer {
  async getBalance (address) {
    return 42
  }

  async getTransactions (address) {
    return [
      {timestamp: '1513683799', hash: '', from: 'fromAddress', to: 'toAddress', amount: 1},
      {timestamp: '1513253473', hash: '', from: 'fromAddress', to: 'toAddress', amount: 1}
    ]
  }
}

module.exports = MockExplorer
