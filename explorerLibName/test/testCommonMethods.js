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
    t.not(explorer.currencyName, undefined)
    t.not(explorer.currencyTicker, undefined)
  })

  test(`[${explorerName}] getBalance`, async t => {
    const balance = await explorer.getBalance(address)
    t.not(balance, undefined)
    t.is(typeof balance, 'number')
  })

  test(`[${explorerName}] getTransactions`, async t => {
    const transactions = await explorer.getTransactions(address)
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
}
