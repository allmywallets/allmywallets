import PricesHistory from '../model/PricesHistory'

const getHistoryLength = (nbDays) => {
  return nbDays * 24 / 6 + 1
}

export const computeHoldingsHistory = (pricesHistory, amountHistory) => {
  return {
    primary: pricesHistory.getValues('primary', amountHistory),
    secondary: pricesHistory.getValues('secondary', amountHistory)
  }
}

export const computeAllHoldingsHistories = (priceHistories, balances) => { // Todo: change this to take balance history into account instead of balances
  const summedAmounts = getSummedAmounts(balances)

  const holdingHistories = {}
  for (const ticker in summedAmounts) {
    const pricesHistory = priceHistories.find(history => history.ticker === ticker)
    if (!summedAmounts.hasOwnProperty(ticker) || !pricesHistory) {
      continue
    }

    const balanceHistory = [...new Array(getHistoryLength(45)).keys()].map(() => summedAmounts[ticker]) // Todo: replace this with balanceHistories[ticker]
    holdingHistories[ticker] = computeHoldingsHistory(pricesHistory, balanceHistory)
  }

  return holdingHistories
}

export const sumHoldingsHistories = holdings => {
  const summedHoldings = { primary: [], secondary: [] }

  if (Object.keys(holdings).length === 0) {
    return summedHoldings
  }

  for (let i = 0; i < getHistoryLength(45); ++i) {
    summedHoldings.primary[i] = 0
    summedHoldings.secondary[i] = 0

    for (const ticker in holdings) {
      summedHoldings.primary[i] += holdings[ticker].primary[i]
      summedHoldings.secondary[i] += holdings[ticker].secondary[i]
    }
  }

  return summedHoldings
}

export const getPeriodPriceHistory = async (ticker, primary, secondary) => {
  const empty = [...new Array(getHistoryLength(45)).keys()].map(() => 0) // Todo: hardcoded 45 values to be changed
  const currencies = { primary: primary, secondary: secondary }
  const prices = { primary: empty, secondary: empty }

  try {
    for (const category in currencies) {
      if (currencies[category] === ticker) {
        prices[category] = [...new Array(getHistoryLength(45)).keys()].map(() => 1)
      }

      const response = await fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${ticker}&tsym=${currencies[category]}&limit=${getHistoryLength(45) - 1}&aggregate=6`)
      const json = await response.json()

      if (json['Data'].length >= getHistoryLength(45)) {
        prices[category] = json['Data'].map(data => data.close)
      }
    }
  } catch (e) {
    console.error(e)

    return new PricesHistory(ticker, prices)
  }

  return new PricesHistory(ticker, prices)
}

export const getSummedAmounts = balances => {
  const amounts = {}

  for (const balance of balances) {
    if (!(balance.ticker in amounts)) {
      amounts[balance.ticker] = 0
    }

    amounts[balance.ticker] += balance.amount
  }

  return amounts
}
