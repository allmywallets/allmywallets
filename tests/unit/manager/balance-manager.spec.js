/* global describe, it, expect */
import 'isomorphic-fetch'
import * as BalanceManager from '../../../src/manager/balance-manager'
import Balance from '../../../src/model/Balance'
import Transaction from '../../../src/model/Transaction'
import Wallet from '../../../src/model/Wallet'

describe('manager/balance-manager.js', () => {
  describe('getBalanceDiff()', () => {
    it('returns a diff with new balance amount when no old balance', () => {
      const newBalance = new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 5, new Date())

      expect(BalanceManager.getBalanceDiff(null, newBalance))
        .toEqual(
          {
            amount: 5,
            balance: newBalance,
            transactions: [new Transaction(`generated.${newBalance.lastUpdate}`, '', newBalance.address, 5)]
          }
        )
    })

    it('returns a valid diff increase', () => {
      const oldBalance = new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 3, new Date())
      const newBalance = new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 5, new Date())

      expect(BalanceManager.getBalanceDiff(oldBalance, newBalance))
        .toEqual(
          {
            amount: 2,
            balance: newBalance,
            transactions: [new Transaction(`generated.${newBalance.lastUpdate}`, '', newBalance.address, 2)]
          }
        )
    })

    it('returns a valid diff decrease', () => {
      const oldBalance = new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 5, new Date())
      const newBalance = new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 3, new Date())

      expect(BalanceManager.getBalanceDiff(oldBalance, newBalance))
        .toEqual(
          {
            amount: -2,
            balance: newBalance,
            transactions: [new Transaction(`generated.${newBalance.lastUpdate}`, newBalance.address, '', 2)]
          }
        )
    })
  })

  describe('compareBalances()', () => {
    it('computes diffs for all related balances', () => {
      const date = new Date()
      const oldBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 5, date),
        new Balance(new Wallet('id', 'MyWallet', 'iota', 'native'), '0x1', 'iota', 'IOTA', 10, date),
        new Balance(new Wallet('id', 'MyWallet', 'bitcoin', 'native'), '0x2', 'bitcoin', 'BTC', 1, date)
      ]
      const newBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 3, date),
        new Balance(new Wallet('id', 'MyWallet', 'iota', 'native'), '0x1', 'iota', 'IOTA', 5, date),
        new Balance(new Wallet('id', 'MyWallet', 'bitcoin', 'native'), '0x2', 'bitcoin', 'BTC', 2, date)
      ]

      expect(BalanceManager.compareBalances(oldBalances, newBalances))
        .toEqual(
          [
            {
              amount: -2,
              balance: newBalances[0],
              transactions: [new Transaction(`generated.${date}`, '0x0', '', 2)]
            },
            {
              amount: -5,
              balance: newBalances[1],
              transactions: [new Transaction(`generated.${date}`, '0x1', '', 5)]
            },
            {
              amount: 1,
              balance: newBalances[2],
              transactions: [new Transaction(`generated.${date}`, '', '0x2', 1)]
            }
          ]
        )
    })

    it('computes diffs for new balances', () => {
      const date = new Date()
      const oldBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 5, date)
      ]
      const newBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 3, date),
        new Balance(new Wallet('id', 'MyWallet', 'iota', 'native'), '0x1', 'iota', 'IOTA', 5, date),
        new Balance(new Wallet('id', 'MyWallet', 'bitcoin', 'native'), '0x2', 'bitcoin', 'BTC', 2, date)
      ]

      expect(BalanceManager.compareBalances(oldBalances, newBalances))
        .toEqual(
          [
            {
              amount: -2,
              balance: newBalances[0],
              transactions: [new Transaction(`generated.${date}`, '0x0', '', 2)]
            },
            {
              amount: 5,
              balance: newBalances[1],
              transactions: [new Transaction(`generated.${date}`, '', '0x1', 5)]
            },
            {
              amount: 2,
              balance: newBalances[2],
              transactions: [new Transaction(`generated.${date}`, '', '0x2', 2)]
            }
          ]
        )
    })

    it('computes diffs for new empty balances', () => {
      const date = new Date()
      const oldBalances = []
      const newBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 0, date),
        new Balance(new Wallet('id', 'MyWallet', 'iota', 'native'), '0x1', 'iota', 'IOTA', 0, date)
      ]

      expect(BalanceManager.compareBalances(oldBalances, newBalances))
        .toEqual(
          [
            {
              amount: 0,
              balance: newBalances[0],
              transactions: [new Transaction(`generated.${date}`, '', '0x0', 0)]
            },
            {
              amount: 0,
              balance: newBalances[1],
              transactions: [new Transaction(`generated.${date}`, '', '0x1', 0)]
            }
          ]
        )
    })

    it('computes ignore diffs for old balances', () => {
      const date = new Date()
      const oldBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 5, date),
        new Balance(new Wallet('id', 'MyWallet', 'iota', 'native'), '0x1', 'iota', 'IOTA', 3, date),
        new Balance(new Wallet('id', 'MyWallet', 'bitcoin', 'native'), '0x2', 'bitcoin', 'BTC', 2, date)
      ]
      const newBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'iota', 'native'), '0x1', 'iota', 'IOTA', 1, date)
      ]

      expect(BalanceManager.compareBalances(oldBalances, newBalances))
        .toEqual(
          [
            {
              amount: -2,
              balance: newBalances[0],
              transactions: [new Transaction(`generated.${date}`, '0x1', '', 2)]
            }
          ]
        )
    })

    it('computes diffs for new balances while ignoring old ones', () => {
      const date = new Date()
      const oldBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'ethereum', 'native'), '0x0', 'ethereum', 'ETH', 5, date),
        new Balance(new Wallet('id', 'MyWallet', 'iota', 'native'), '0x1', 'iota', 'IOTA', 5, date)
      ]
      const newBalances = [
        new Balance(new Wallet('id', 'MyWallet', 'bitcoin', 'native'), '0x2', 'bitcoin', 'BTC', 2, date)
      ]

      expect(BalanceManager.compareBalances(oldBalances, newBalances))
        .toEqual(
          [
            {
              amount: 2,
              balance: newBalances[0],
              transactions: [new Transaction(`generated.${date}`, '', '0x2', 2)]
            }
          ]
        )
    })
  })
})
