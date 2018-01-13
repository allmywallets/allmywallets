import Proxy from '../providers'
import database from '../database'
import Transaction from '../model/Transaction'

export const getBalanceDiff = (oldBalance, newBalance) => {
  if (!oldBalance) {
    return {
      amount: newBalance.amount,
      // Todo: grab transactions from providers
      transactions: [new Transaction(`generated.${newBalance.lastUpdate}`, '', newBalance.address, newBalance.amount)],
      balance: newBalance
    }
  }

  if (oldBalance.currency !== newBalance.currency) {
    throw new Error('Cannot compare two balances with different currencies')
  }

  const diff = {}
  diff.balance = newBalance

  // We allow to skip compensated in & out transactions in the refresh rate time interval
  if (oldBalance.amount === newBalance.amount) {
    diff.amount = 0
    diff.transactions = []

    return diff
  }

  diff.amount = newBalance.amount - oldBalance.amount
  diff.transactions = [] // Todo: grab transactions from providers

  if (diff.transactions.length === 0) {
    let from = ''
    let to = ''

    diff.amount > 0 ? to = newBalance.address : from = newBalance.address

    diff.transactions.push(new Transaction(`generated.${newBalance.lastUpdate}`, from, to, Math.abs(diff.amount)))
  }

  return diff
}

export const compareBalances = (oldBalances, newBalances) => {
  const diffs = []

  for (const key in newBalances) {
    const oldBalance = oldBalances.find(oldBalance => oldBalance.currency === newBalances[key].currency)

    const diff = getBalanceDiff(oldBalance, newBalances[key])
    if (diff.transactions.length !== 0) {
      diffs.push(diff)
    }
  }

  return diffs
}

export const syncBalances = async (wallet) => {
  const newBalances = await new Proxy(wallet.network, wallet.provider, wallet.parameters).getWalletData()
  const oldBalances = await database.findBalances(newBalances.map(balance => balance.id))

  const diffs = compareBalances(oldBalances, newBalances)

  await database.storeBalances(newBalances)

  return diffs
}
