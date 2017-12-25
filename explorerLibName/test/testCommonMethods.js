const test = require('ava')
const libName = require('../')
const testAddresses = require('./fixtures.json').addresses

const explorersName = libName.list()
let explorers = []
for (let i = 0; i < explorersName.length; i++) {
  const Explorer = libName.explorer(explorersName[i])
  explorers[i] = new Explorer()
}

for (let i = 0; i < explorers.length; i++) {
  const explorer = explorers[i]
  const explorerName = explorersName[i]
  const address = testAddresses[explorerName]

  test(`[${explorerName}] attributes`, async t => {
    t.not(explorer.constructor.getDefaultTicker(), undefined)
    t.not(explorer.supportedCurrencies, undefined)
  })

  test(`[${explorerName}] fetch only balances`, async t => {
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
    const fakeTickerName = 'NOT SUPPORTED TICKER'
    const error = await t.throws(() => explorer
        .currency(fakeTickerName)
        .address(address)
        .fetch(['balances'])
        .exec())
    t.is(error.message, `${fakeTickerName} is not supported`)
  })
}
