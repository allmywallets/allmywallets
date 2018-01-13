export const computeHoldingsHistory = (priceHistory, balanceHistory) => {
  const holdings = []

  for (let i = 0; i < priceHistory.length; ++i) {
    holdings.push(priceHistory[i] * balanceHistory[i])
  }

  return holdings
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

export const getPeriodPriceHistory = async (ticker, nbDays = 45) => {
  return fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${ticker}&tsym=USD&limit=${nbDays * 24 / 6}&aggregate=6&e=CCCAGG`)
    .then(response => response.json())
    .then(json => {
      if (json['Data'].length < nbDays * 24 / 6) {
        return [...new Array(nbDays * 24 / 6).keys()].map(() => 0)
      }

      return json['Data'].map(price => price.close)
    })
    .catch(() => {
      return [...new Array(nbDays * 24 / 6).keys()].map(() => 0)
    })
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
