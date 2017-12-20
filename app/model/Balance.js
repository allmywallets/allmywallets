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
   * @param {string} unit
   * @param {number} amount
   * @param {array<Transaction>} transactions
   */
  constructor (currency, unit, amount, transactions) {
    this._currency = currency
    this._unit = unit
    this._amount = amount
    this._transactions = transactions
  }

  get currency () {
    return this._currency
  }

  get unit () {
    return this._unit
  }

  get amount () {
    return this._amount
  }

  get transactions () {
    return this._transactions
  }

  static fromObject (object) {
    return new Balance(
      object._currency,
      object._unit,
      object._amount,
      object._transactions.map(transaction => Transaction.fromObject(transaction))
   )
  }
}
