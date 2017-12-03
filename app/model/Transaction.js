export default class Transaction {
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
    const transaction = new Transaction()

    transaction._type = object._type
    transaction._from = object._from
    transaction._to = object._to
    transaction._amount = object._amount

    return transaction
  }
}
