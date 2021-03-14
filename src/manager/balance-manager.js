import Proxy from "./providers"
import database from "./database"
import Transaction from "../model/Transaction"
import Wallet from "../model/Wallet"
import Balance from "../model/Balance"

export const getBalanceDiff = (oldBalance, newBalance) => {
  if (!oldBalance) {
    return {
      amount: newBalance.amount,
      // Todo: grab transactions from providers
      transactions: [
        new Transaction(
          `generated.${newBalance.lastUpdate}`,
          "",
          newBalance.address,
          newBalance.amount
        )
      ],
      balance: newBalance
    }
  }

  if (oldBalance.currency !== newBalance.currency) {
    throw new Error("Cannot compare two balances with different currencies")
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
    let from = ""
    let to = ""

    diff.amount > 0 ? (to = newBalance.address) : (from = newBalance.address)

    diff.transactions.push(
      new Transaction(
        `generated.${newBalance.lastUpdate}`,
        from,
        to,
        Math.abs(diff.amount)
      )
    )
  }

  return diff
}

export const compareBalances = (oldBalances, newBalances) => {
  const diffs = []

  for (const key in newBalances) {
    const oldBalance = oldBalances.find(
      oldBalance => oldBalance.currency === newBalances[key].currency
    )

    const diff = getBalanceDiff(oldBalance, newBalances[key])
    if (diff.transactions.length !== 0) {
      diffs.push(diff)
    }
  }

  return diffs
}

export const syncBalances = async wallet => {
  const newBalances = await new Proxy(wallet).getBalances()
  const oldBalances = await database.findBalances(
    newBalances.map(balance => balance.id)
  )

  const diffs = compareBalances(oldBalances, newBalances)

  await database.storeBalances(newBalances)

  return diffs
}

export const collapseBalances = balances => {
  const collapsed = {}

  balances.forEach(balance => {
    if (balance.currency in collapsed) {
      const existingBalance = collapsed[balance.currency]

      existingBalance.increaseAmount(balance.amount)
      existingBalance.lastUpdate =
        balance.lastUpdate < existingBalance.lastUpdate
          ? balance.lastUpdate
          : existingBalance.lastUpdate
      let nbWallets = existingBalance.wallet.name.replace(/\D/g, "")
      existingBalance.wallet.name = `${++nbWallets} wallets`
      existingBalance.wallet.network =
        existingBalance.wallet.network === balance.wallet.network
          ? balance.wallet.network
          : "Multiple networks"
      existingBalance.wallet.provider =
        existingBalance.wallet.provider === balance.wallet.provider
          ? balance.wallet.provider
          : "Multiple providers"
    } else {
      const aggregateWallet = new Wallet(
        balance.currency,
        "1 wallet",
        balance.wallet.network,
        balance.wallet.provider
      )
      collapsed[balance.currency] = new Balance(
        aggregateWallet,
        "",
        balance.currency,
        balance.ticker,
        balance.amount,
        balance.lastUpdate
      )
    }
  })

  return Object.keys(collapsed).map(k => collapsed[k])
}
