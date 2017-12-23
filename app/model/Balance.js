import Transaction from './Transaction'

/**
 * A balance represents the amount of coins in
 * a specific currency.
 */
export default class Balance {
  /**
   * Creates a new Balance
   *
   * @param {string} currency
   * @param {string} ticker
   * @param {number} amount
   * @param {Date} lastUpdate
   * @param {array<Transaction>} transactions
   */
  constructor (currency, ticker, amount, lastUpdate, transactions) {
    this._currency = currency
    this._ticker = ticker
    this._amount = amount
    this._lastUpdate = lastUpdate
    this._transactions = transactions
  }

  get currency () {
    return this._currency
  }

  get ticker () {
    return this._ticker
  }

  get amount () {
    return this._amount
  }

  get transactions () {
    return this._transactions
  }

  get lastUpdate () {
    return this._lastUpdate
  }

  static fromObject (object) {
    return new Balance(
      object._currency,
      object._ticker,
      object._amount,
      object._lastUpdate,
      object._transactions.map(transaction => Transaction.fromObject(transaction))
   )
  }
}
