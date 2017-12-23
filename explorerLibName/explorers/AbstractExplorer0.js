const NotSupportedCurrencyError = require('./errors/NotSupportedCurrencyError')

class AbstractExplorer0 {
  constructor (params) {
    this.params = params

    this.addresses = []
    this.wallets = []

    this.tickers = []
    this.elementsToFetch = []

    this.currencyName = 'Currency'
    this.currencyTicker = 'CUR'

    this.supportedTickers = ['CUR']
  }

  wallets (wallets) {
    wallets.forEach(wallet => this.wallets.push(wallet))
    return this
  }

  address (address) {
    this.addresses.push(address)
    return this
  }
  addresses (addresses) {
    addresses.forEach(address => this.addresses.push(address))
    return this
  }

  currency (ticker) {
    if (!this.supportedTickers.includes(ticker)) throw new NotSupportedCurrencyError('WIP')

    this.tickers.push(ticker)
    return this
  }
  currencies (tickers) {
    tickers.forEach(ticker => this.currency(ticker))
    return this
  }

  fetch (fetchs) {
    this.elementsToFetch = fetchs
    return this
  }

  transactionsLimit (limit) {
    this.transactionsLimit = limit
    return this
  }

  transactionsStartDate () {
    throw new Error('Not yet implemented')
  }

  static getExplorerParams () {
    return [{
      type: 'input',
      inputType: 'text',
      label: 'API key (optional)',
      model: 'apiKey'
    }]
  }

  static getAddressParam () {
    return [{
      type: 'input',
      inputType: 'text',
      label: 'AbstractExplorer address',
      model: 'address',
      required: true
    }]
  }

  async _getBalances (address, result) {
    throw new Error('This method should be implemented by child class')
  }
  async _getTransactions (address, result) {
    throw new Error('This method should be implemented by child class')
  }

  async exec () {
    let promises = []
    let wallets = []

    this.addresses.forEach(address => {
      const wallet = {}
      if (this.elementsToFetch.includes('balances')) {
        promises.push(this._getBalances(address, wallet))
      }

      if (this.elementsToFetch.includes('transactions')) {
        promises.push(this._getTransactions(address, wallet))
      }

      wallets.push(wallet)
    })

    await Promise.all(promises)

    return wallets
  }

  static async _fetchJson (url) {
    // TODO : require('node-fetch')
    return require('node-fetch')(url).then((response) => response.json())
  }
}

module.exports = AbstractExplorer0

/*
// config
  {
    explorer: 'BitcoinBlockExplorer',

    // Specific
    explorerParams: {node: 'https://iota.thathost.net', apiKey: '16546548'}, // Returned by explorer a.getParams()

    // Mandatory
    walletIdentifier : {address: '13213213212313213'},

    // optional
    currencies: ['BTC']
  }

// Example
  explorer = TrucExplorer(parameters);
  explorer
    .wallets([{address: '0x010101'}, {address: '0x001010'}])
    .currencies(['ETH', 'NEO', 'GAS'])
    .transactionsLimit([5, 5, 5])
    .transactionsStartDate([5, 5, 5])
    .units(['miota', 'satoshi', 'lol'])
    .fetch(['balances', 'transactions', 'sandwich'])
    .exec()

  // out
  {
     [{
      balances : [
      {name: 'bitcoin', balance: 9}, {name: 'lol', balance: 9}
    ],
    transactions : [
      [new Transaction(), new Transaction()],
      [new Transaction(), new Transaction()]
    ]
  },
  ]
}

*/
