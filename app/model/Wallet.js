import Transaction from './Transaction'

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

  static fromObject (object) {
    const wallet = new Wallet()

    wallet._name = object._name
    wallet._currency = object._currency
    wallet._unit = object._unit
    wallet._amount = object._amount

    wallet._transactions = []
    object._transactions.forEach((transaction) => {
      wallet._transactions.push(Transaction.fromObject(transaction))
    })

    return wallet
  }
}
