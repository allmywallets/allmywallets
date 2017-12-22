const test = require('ava')
const libName = require('../')

const testAddresses = require('./fixtures.json').addresses

const explorerName = 'EthereumEtherscan'
const Explorer = libName.explorer(explorerName)
const explorer = new Explorer()

const address = testAddresses[explorerName]

test(`[${explorerName}] getTokenBalance`, async t => {
  const balance = await explorer.getTokenBalance(address, '0x0d8775f648430679a709e98d2b0cb6250d2887ef')
  t.not(balance, undefined)
  t.is(typeof balance, 'number')
})

test(`[${explorerName}] getTokenBalanceByTicker`, async t => {
  const balance = await explorer.getTokenBalanceByTicker(address, 'BAT')
  t.not(balance, undefined)
  t.is(typeof balance, 'number')
})
