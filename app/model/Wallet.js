import Balance from './Balance'

/**
 * A wallet is a set of balances. A wallet can have multiple
 * balances (e.g. token balances from an Ethereum wallet).
 */
export default class Wallet {
  /**
   * Creates a new wallet.
   *
   * @param {string} name
   * @param {array<Balance>} balances
   * @param {Date} lastUpdate
   */
  constructor (name, balances, lastUpdate) {
    this._name = name
    this._balances = balances
    this._lastUpdate = lastUpdate
  }

  get name () {
    return this._name
  }

  get balances () {
    return this._balances
  }

  get lastUpdate () {
    return this._lastUpdate
  }

  static fromObject (object) {
    return new Wallet(
      object._name,
      object._balances.map(balance => Balance.fromObject(balance)),
      object._lastUpdate
    )
  }
}
