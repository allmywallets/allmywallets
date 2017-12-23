import GlobalError from './GlobalError'

export default class BalanceRefreshError extends GlobalError {
  constructor (walletId, currency, ...params) {
    super(params)

    this._walletId = walletId
    this._currency = currency
  }

  get walletId () {
    return this._walletId
  }

  get currency () {
    return this._currency
  }
}
