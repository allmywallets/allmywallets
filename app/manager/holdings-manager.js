import PricesHistory from '../model/PricesHistory'

export const computeHoldingsHistory = (pricesHistory, balanceHistory) => {
  const holdings = []
  const prices = pricesHistory.getPrices('primary')

  for (let i = 0; i < prices.length; ++i) {
    holdings.push(prices[i] * balanceHistory[i])
  }

  return holdings
}

export const computeAllHoldingsHistories = (priceHistories, balances) => { // Todo: change this to take balance history into account instead of balances
  const summedAmounts = getSummedAmounts(balances)

  const holdingHistories = {}
  for (const ticker in summedAmounts) {
    const pricesHistory = priceHistories.find(history => history.ticker === ticker)
    if (!summedAmounts.hasOwnProperty(ticker) || !pricesHistory) {
      continue
    }

    holdingHistories[ticker] = computeHoldingsHistory(
      pricesHistory,
      [...new Array(pricesHistory.getPrices('primary').length).keys()].map(() => summedAmounts[ticker]) // Todo: replace this with balanceHistories[ticker]
    )
  }

  return holdingHistories
}

export const sumHoldingsHistories = holdings => {
  if (Object.keys(holdings).length === 0) {
    return []
  }

  const periodLength = holdings[Object.keys(holdings)[0]].length
  for (const ticker in holdings) {
    if (periodLength !== holdings[ticker].length) {
      throw new Error('Holdings history periods should have the same length')
    }
  }

  const summedValues = []
  for (let i = 0; i < periodLength; ++i) {
    summedValues[i] = 0
    for (const ticker in holdings) {
      summedValues[i] += holdings[ticker][i]
    }
  }

  return summedValues
}

export const getPeriodPriceHistory = async (ticker, primary, secondary, nbDays = 45) => {
  const empty = [...new Array(nbDays * 24 / 6 + 1).keys()].map(() => 0)
  const currencies = { primary: primary, secondary: secondary }
  const prices = { primary: empty, secondary: empty }

  try {
    for (const category in currencies) {
      if (currencies[category] === ticker) {
        continue
      }

      const response = await fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${ticker}&tsym=${currencies[category]}&limit=${nbDays * 24 / 6}&aggregate=6`)
      const json = await response.json()

      if (json['Data'].length >= nbDays * 24 / 6) {
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
