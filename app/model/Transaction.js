/**
 * A transaction is a coins exchange between
 * two balances or wallets.
 */
export default class Transaction {
  /**
   * Creates a new transaction.
   *
   * @param {string} type
   * @param {string} from
   * @param {string} to
   * @param {number} amount
   */
  constructor (type, from, to, amount) {
    this._type = type
    this._from = from
    this._to = to
    this._amount = amount
  }

  get type () {
    return this._type
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
      object._type,
      object._from,
      object._to,
      object._amount
    )
  }
}
