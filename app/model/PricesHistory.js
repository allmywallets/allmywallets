export default class PricesHistory {
  constructor (ticker, prices) {
    this._ticker = ticker
    this._prices = prices
  }

  get ticker () {
    return this._ticker
  }

  getPrices (category) {
    return this._prices[category].values
  }

  getLastMovement (category) {
    const prices = this.getPrices(category)

    return prices[prices.length - 1] / prices[prices.length - 3] * 100 - 100
  }

  getCurrentPrices () {
    const primary = this.getPrices('primary')
    const secondary = this.getPrices('secondary')

    const prices = {}
    prices.primary = {
      ticker: this._prices.primary.ticker,
      price: primary[primary.length - 1]
    }
    prices.secondary = {
      ticker: this._prices.secondary.ticker,
      price: secondary[secondary.length - 1]
    }

    return prices
  }

  getCurrentValues (amount) {
    const currentPrices = this.getCurrentPrices()

    currentPrices.primary.value = currentPrices.primary.price * amount
    currentPrices.secondary.value = currentPrices.secondary.price * amount

    return currentPrices
  }
}
