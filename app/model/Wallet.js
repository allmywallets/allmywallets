import Balance from './Balance'

/**
 * A wallet is a set of balances. A wallet can have multiple
 * balances (e.g. token balances from an Ethereum wallet).
 */
export default class Wallet {
  /**
   * Creates a new wallet.
   *
   * @param {array<Balance>} balances
   * @param {Date} lastUpdate
   */
  constructor (balances, lastUpdate) {
    this._balances = balances
    this._lastUpdate = lastUpdate
  }

  get balances () {
    return this._balances
  }

  get lastUpdate () {
    return this._lastUpdate
  }

  static fromObject (object) {
    return new Wallet(
      object._balances.map(balance => Balance.fromObject(balance)),
      object._lastUpdate
    )
  }
}
