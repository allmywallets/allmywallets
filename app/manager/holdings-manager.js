export const computeHoldings = async (balances) => {
  const holdings = []

  for (const balance of balances) {
    await fetch(`https://api.coinmarketcap.com/v1/ticker/${balance.currency.toLowerCase().split(' ').join('-')}/`)
      .then(response => response.json())
      .then(json => { // Todo: move this in indexedDB
        json = json[0]
        holdings.push({
          btc: json.price_btc * balance.amount,
          usd: json.price_usd * balance.amount
        })
      })
      .catch()
  }

  return holdings
}
