export default class Wallet {
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
}
