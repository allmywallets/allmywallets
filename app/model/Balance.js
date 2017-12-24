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

  set walletId (walletId) {
    this._walletId = walletId
  }

  get walletId () {
    return this._walletId
  }

  is (walletId, currency) {
    return this._walletId === walletId && this._currency === currency
  }

  get id () {
    return `${this._walletId}.${this._currency}`
  }

  static fromObject (object) {
    const balance = new Balance(
      object._currency,
      object._ticker,
      object._amount,
      object._lastUpdate,
      object._transactions.map(transaction => Transaction.fromObject(transaction))
    )

    balance.walletId = object._walletId

    return balance
  }
}
