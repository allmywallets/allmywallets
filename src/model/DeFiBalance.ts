import Wallet from "./Wallet"

type TokenAmounts = { [token: string]: number }

/**
 * A DeFi balance represents the amount of tokens in
 * a DeFi wallet.
 */
export class DeFiBalance {
  constructor(
    private readonly _wallet: Wallet,
    private readonly _platform: string,
    private readonly _address: string,
    private readonly _tokens: TokenAmounts,
    private readonly _lpToken: string,
    private readonly _lpTokenAmount: number,
    private readonly _totalDeposited: number,
    private readonly _rewardPerYear: TokenAmounts,
    private readonly _pendingRewards: TokenAmounts,
    private _lastUpdate: Date
  ) {}

  get platform() {
    return this._platform
  }

  get address() {
    return this._address
  }

  get deposit() {
    return this._totalDeposited
  }

  get yield() {
    return this._lpTokenAmount - this._totalDeposited
  }

  get pendingRewards() {
    return this._pendingRewards
  }

  get rewardPerYear() {
    return this._rewardPerYear
  }

  get lastUpdate() {
    return this._lastUpdate
  }

  set lastUpdate(lastUpdate: Date) {
    this._lastUpdate = lastUpdate
  }

  get wallet() {
    return this._wallet
  }

  /**
   * Checks if two balances are the same
   *
   * @param {DeFiBalance} balance
   * @returns {boolean}
   */
  equals(balance: DeFiBalance) {
    return balance.id === this.id
  }

  get id() {
    return `${this.wallet.id}.${this._platform}.${this._lpToken}`
  }
}
