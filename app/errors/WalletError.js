export default class WalletError {
  constructor (walletId, message, stack) {
    this._walletId = walletId
    this._message = message
    this._stack = stack
  }

  get walletId () {
    return this._walletId
  }

  get message () {
    return this._message
  }

  get stack () {
    return this._stack
  }

  static fromObject (object) {
    return new WalletError(object._walletId, object._message, object._stack)
  }
}
