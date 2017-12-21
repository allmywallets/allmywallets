const libName = require('./')
const Explorer = libName.explorer('EthereumEtherscan')
const explorer = new Explorer();

(async function () {
  const address = '0xB13CE87F4f0519B54f768847Bda0389cEF0d479B'

  const balance = await explorer.getBalance(address)
  console.log(balance)

  const transactions = await explorer.getTransactions(address)
  console.log(transactions)
}()).catch(console.log)
