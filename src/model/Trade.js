/**
 * A trade is a exchang between two currencies
 */
export default class Trade {
  /**
   * Creates a new trade.
   *
   * @param {string} type
   * @param {number} price
   * @param {number} exchangedAmount
   * @param {string} exchangedCurrency
   */
  constructor(type, price, exchangedAmount, exchangedCurrency) {
    this._type = type
    this._price = price
    this._exchangedAmount = exchangedAmount
    this._exchangedCurrency = exchangedCurrency
  }

  get type() {
    return this._type
  }

  get price() {
    return this._price
  }

  get exchangedAmount() {
    return this._exchangedAmount
  }

  get exchangedCurrency() {
    return this._exchangedCurrency
  }
}
