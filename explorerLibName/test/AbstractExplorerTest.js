const test = require('ava')
const libName = require('../')
const testAddresses = require('./fixtures.json').addresses
const testParameters = require('./fixtures.json').parameters
const NotSupportedCurrencyError = require('../src/errors/NotSupportedCurrencyError')
const OnlyEmptyBalancesFound = require('../src/errors/OnlyEmptyBalancesFound')

const explorersName = libName.list()
let explorers = []
for (let i = 0; i < explorersName.length; i++) {
  const Explorer = libName.explorer(explorersName[i])
  explorers[i] = Explorer
}

for (let i = 0; i < explorers.length; i++) {
  const Explorer = explorers[i]
  const explorerName = explorersName[i]
  let address = testAddresses[explorerName]
  let params = testParameters[explorerName]
  if (!address) {
    address = require('./fixturesExchanges.json').addresses[explorerName]
  }

  test(`[${explorerName}] attributes`, async t => {
    const explorer = new Explorer(params)
    t.not(explorer.constructor.getDefaultTicker(), undefined)
    t.not(explorer.supportedCurrencies, undefined)
  })

  let explorer = new Explorer(params)
  if (explorer.isExchange) {
    test(`[${explorerName}] Throws empty balances`, async t => {
      const explorer = new Explorer(params)
      await t.throws(
        explorer
          .address(address)
          .fetch(['balances'])
          .exec(), OnlyEmptyBalancesFound)
    })
  }
  test(`[${explorerName}] fetch only balances`, async t => {
    const explorer = new Explorer(params)
    if (explorer.isExchange) { explorer.currency('BTC') }
    const res = await explorer
        .address(address)
        .fetch(['balances'])
        .exec()

    t.not(res, undefined)

    const firstCurrency = res[0]

    t.not(firstCurrency, undefined)
    t.is(firstCurrency.transactions, undefined, 'We fetch only balances')

    const balances = firstCurrency.balances
    t.not(balances, undefined)
    t.is(balances.length, 1)
    t.is(typeof balances[0], 'number')
  })

  test(`[${explorerName}] fetch only transactions`, async t => {
    const explorer = new Explorer(params)

    const res = await explorer
        .address(address)
        .fetch(['transactions'])
        .exec()

    t.not(res, undefined)

    const firstCurrency = res[0]

    t.not(firstCurrency, undefined)
    t.is(firstCurrency.balances, undefined, 'We fetch only transactions')
    t.is(firstCurrency.transactions.length, 1)

    const transactions = firstCurrency.transactions[0]
    t.not(transactions, undefined)
    transactions.forEach(tx => {
      t.not(tx.timeStamp, undefined)
      t.not(tx.id, undefined)
      t.not(tx.from, undefined)
      t.not(tx.to, undefined)
      t.not(tx.amount, undefined)
      t.not(tx.type, undefined)
      t.is(tx.type === 'in' || tx.type === 'out', true)
    })
  })

  test(`[${explorerName}] Not supported currency`, async t => {
    const explorer = new Explorer(params)

    const fakeTickerName = 'NOT SUPPORTED TICKER'
    let error
    if (explorer.dynamicSupportedCurrencies) {
      error = await t.throws(explorer
          .currency(fakeTickerName)
          .address(address)
          .fetch(['balances'])
          .exec(), NotSupportedCurrencyError)
    } else {
      error = await t.throws(() => explorer.currency(fakeTickerName), NotSupportedCurrencyError)
    }
    t.is(error.message, `${fakeTickerName} is not supported`)
  })
}
