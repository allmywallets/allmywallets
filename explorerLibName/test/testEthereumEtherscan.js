const test = require('ava')
const libName = require('../')

const testAddresses = require('./fixtures.json').addresses

const explorerName = 'EthereumEtherscan'
const Explorer = libName.explorer(explorerName)

const address = testAddresses[explorerName]

test(`[${explorerName}] Custom tokens`, async t => {
  const customTokens = {'MKR': {contractAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', ticker: 'MKR', name: 'Maker'}}
  let explorer = new Explorer({customTokens})
  const res = await explorer
      .address(address)
      .currency('MKR')
      .fetch(['balances', 'transactions'])
      .exec()

  t.not(res, undefined)
  t.not(res[0], undefined)
  t.not(res[0].transactions, undefined)
  t.not(res[0].balances, undefined)
  t.not(res[0].balances[0] instanceof Number, true)
})

test(`[${explorerName}] Get tokens`, async t => {
  let explorer = new Explorer()
  const res = await explorer
      .address(address)
      .currency('BAT')
      .fetch(['balances', 'transactions'])
      .exec()

  t.not(res, undefined)
  t.not(res[0], undefined)
  t.not(res[0].transactions, undefined)
  t.not(res[0].balances, undefined)
  t.not(res[0].balances[0] instanceof Number, true)
})
