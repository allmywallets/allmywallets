export default class PricesHistory {
  constructor (ticker, prices) {
    this._ticker = ticker
    this._prices = prices
  }

  get ticker () {
    return this._ticker
  }

  getPrices (category) {
    return this._prices[category]
  }

  getLastMovement (category) {
    const prices = this.getPrices(category)

    return prices[prices.length - 1] / prices[prices.length - 3] * 100 - 100
  }

  getCurrentPrices () {
    const primary = this.getPrices('primary')
    const secondary = this.getPrices('secondary')

    const prices = {}
    prices.primary = primary[primary.length - 1]
    prices.secondary = secondary[secondary.length - 1]

    return prices
  }

  getCurrentValues (amount) {
    const currentPrices = this.getCurrentPrices()

    currentPrices.primary = currentPrices.primary * amount
    currentPrices.secondary = currentPrices.secondary * amount

    return currentPrices
  }
}
