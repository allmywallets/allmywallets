const test = require('ava')
const libName = require('../')
const explorersName = libName.list()

let explorers = []
for (let i = 0; i < explorersName.length; i++) {
  const Explorer = libName.explorer(explorersName[i])
  explorers[i] = new Explorer({key: '', secret: ''})
}

const testAddresses = ['15jdxjFhXUsp2xuycmKnjw8yk1WsVon69c', '0xB13CE87F4f0519B54f768847Bda0389cEF0d479B']

for (let i = 0; i < explorers.length; i++) {
  const explorer = explorers[i]
  const explorerName = explorersName[i]
  const address = testAddresses[i]

  test(`[${explorerName}] getBalance`, async t => {
    const balance = await explorer.getBalance(address)
    t.not(balance, undefined)
  })

  test(`[${explorerName}] getTransactions`, async t => {
    const transactions = await explorer.getTransactions(address)
    t.not(transactions, undefined)
  })
}
