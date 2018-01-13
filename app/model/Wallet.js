/**
 * A Wallet is an AMW balances container which
 * is a set of balances (with or without the same currencies)
 */
export default class Wallet {
  /**
   * Creates a new Wallet
   *
   * @param {string} id of the wallet
   * @param {string} name of the wallet
   * @param {string} network of the wallet (e.g. IOTA network, Exchange network)
   * @param {string} provider of the wallet (e.g. Etherscan, Binance)
   */
  constructor (id, name, network, provider) {
    this._id = id
    this._name = name
    this._network = network
    this._provider = provider
  }

  get id () {
    return this._id
  }

  get name () {
    return this._name
  }

  set name (name) {
    this._name = name
  }

  get network () {
    return this._network
  }

  get provider () {
    return this._provider
  }

  static fromObject (object) {
    return new Wallet(
      object._id,
      object._name,
      object._network,
      object._provider
    )
  }
}
