export default class Wallet {
  constructor (name, currency, unit, amount, transactions) {
    this._name = name
    this._currency = currency
    this._unit = unit
    this._amount = amount
    this._transactions = transactions
  }

  get name () {
    return this._name
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
}
