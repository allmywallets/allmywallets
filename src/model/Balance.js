import Wallet from './Wallet'

/**
 * A balance represents the amount of coins in
 * a specific currency.
 */
export default class Balance {
  /**
   * Creates a new Balance
   *
   * @param {Wallet} wallet
   * @param {string} address
   * @param {string} currency
   * @param {string} ticker
   * @param {number} amount
   * @param {Date} lastUpdate
   */
  constructor (wallet, address, currency, ticker, amount, lastUpdate) {
    this._wallet = wallet
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

  increaseAmount (amount) {
    this._amount += amount
  }

  get lastUpdate () {
    return this._lastUpdate
  }

  set lastUpdate (lastUpdate) {
    this._lastUpdate = lastUpdate
  }

  get wallet () {
    return this._wallet
  }

  /**
   * Checks if two balances are the same
   *
   * @param {Balance} balance
   * @returns {boolean}
   */
  equals (balance) {
    return this.ticker === balance.ticker && this.wallet.id === balance.wallet.id
  }

  get id () {
    return `${this.wallet.id}.${this.ticker}`
  }

  static fromObject (object) {
    return new Balance(
      Wallet.fromObject(object._wallet),
      object._address,
      object._currency,
      object._ticker,
      object._amount,
      object._lastUpdate
    )
  }
}
