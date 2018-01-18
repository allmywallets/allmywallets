/**
 * A transaction is a coins exchange between
 * two balances or wallets.
 */
export default class Transaction {
  /**
   * Creates a new transaction.
   *
   * @param {string} id
   * @param {string} from
   * @param {string} to
   * @param {number} amount
   */
  constructor (id, from, to, amount) {
    this._id = id
    this._from = from
    this._to = to
    this._amount = amount
  }

  hasTrade () {
    return !!this._trade
  }

  set trade (trade) {
    this._trade = trade
  }

  get trade () {
    return this._trade
  }

  get id () {
    return this._id
  }

  get from () {
    return this._from
  }

  get to () {
    return this._to
  }

  get amount () {
    return this._amount
  }

  static fromObject (object) {
    return new Transaction(
      object._id,
      object._from,
      object._to,
      object._amount
    )
  }
}
