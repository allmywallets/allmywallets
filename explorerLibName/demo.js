const libName = require('./')
const Explorer = libName.explorer('BitcoinBlockExplorer')
const explorer = new Explorer();

(async function () {
  const balance = await explorer.getBalance('1D7jNbrCz5kbvxAZNjtczEHSDiumWuSdMk')
  console.log(balance)
}()).catch(console.log)
