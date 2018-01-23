/**
 * A PricesHistory is a set of primary and secondary prices stored into
 * an object for a specific ticker.
 */
export default class PricesHistory {
  /**
   * Creates a PricesHistory.
   *
   * @param ticker for which the history is stored
   * @param prices stored in an object with two keys primary/secondary
   */
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

  getValues (category, amountHistory) {
    const prices = this.getPrices(category)

    if (prices.length !== amountHistory.length) {
      throw new Error('Amount history should have the same length than prices history')
    }

    return prices.map((price, key) => price * amountHistory[key])
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
