/**
 * A balance represents the amount of coins in
 * a specific currency.
 */
export default class Balance {
  /**
   * Creates a new Balance
   *
   * @param {string} address
   * @param {string} currency
   * @param {string} ticker
   * @param {number} amount
   * @param {Date} lastUpdate
   */
  constructor (address, currency, ticker, amount, lastUpdate) {
    this._address = address
    this._currency = currency
    this._ticker = ticker
    this._amount = amount
    this._lastUpdate = lastUpdate
  }

  get address () {
    return this._address
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

  get lastUpdate () {
    return this._lastUpdate
  }

  set walletId (walletId) {
    this._walletId = walletId
  }

  get walletId () {
    return this._walletId
  }

  /**
   * Checks if two balances are the same
   *
   * @param {Balance} balance
   * @returns {boolean}
   */
  equals (balance) {
    return this.walletId === balance.walletId && this.ticker === balance.ticker
  }

  get id () {
    return `${this._walletId}.${this._ticker}`
  }

  static fromObject (object) {
    const balance = new Balance(
      object._address,
      object._currency,
      object._ticker,
      object._amount,
      object._lastUpdate
    )

    balance.walletId = object._walletId

    return balance
  }
}
