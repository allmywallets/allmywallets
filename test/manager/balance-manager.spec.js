import { describe, it } from 'mocha'
import { assert } from 'chai'
import * as BalanceManager from '../../app/manager/balance-manager'
import Balance from '../../app/model/Balance'
import Transaction from '../../app/model/Transaction'

describe('manager/balance-manager.js', () => {
  describe('getBalanceDiff()', () => {
    it('returns a diff with new balance amount when no old balance', () => {
      const newBalance = new Balance('0x0', 'ethereum', 'ETH', 5, new Date())

      assert.deepEqual(
        BalanceManager.getBalanceDiff(null, newBalance),
        {
          amount: 5,
          balance: newBalance,
          transactions: [new Transaction(`generated.${newBalance.lastUpdate}`, '', newBalance.address, 5)]
        }
      )
    })

    it('returns a valid diff increase', () => {
      const oldBalance = new Balance('0x0', 'ethereum', 'ETH', 3, new Date())
      const newBalance = new Balance('0x0', 'ethereum', 'ETH', 5, new Date())

      assert.deepEqual(
        BalanceManager.getBalanceDiff(oldBalance, newBalance),
        {
          amount: 2,
          balance: newBalance,
          transactions: [new Transaction(`generated.${newBalance.lastUpdate}`, '', newBalance.address, 2)]
        }
      )
    })

    it('returns a valid diff decrease', () => {
      const oldBalance = new Balance('0x0', 'ethereum', 'ETH', 5, new Date())
      const newBalance = new Balance('0x0', 'ethereum', 'ETH', 3, new Date())

      assert.deepEqual(
        BalanceManager.getBalanceDiff(oldBalance, newBalance),
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
        new Balance('0x0', 'ethereum', 'ETH', 5, date),
        new Balance('0x1', 'iota', 'IOTA', 10, date),
        new Balance('0x2', 'bitcoin', 'BTC', 1, date)
      ]
      const newBalances = [
        new Balance('0x0', 'ethereum', 'ETH', 3, date),
        new Balance('0x1', 'iota', 'IOTA', 5, date),
        new Balance('0x2', 'bitcoin', 'BTC', 2, date)
      ]

      assert.deepEqual(
        BalanceManager.compareBalances(oldBalances, newBalances),
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
        new Balance('0x0', 'ethereum', 'ETH', 5, date)
      ]
      const newBalances = [
        new Balance('0x0', 'ethereum', 'ETH', 3, date),
        new Balance('0x1', 'iota', 'IOTA', 5, date),
        new Balance('0x2', 'bitcoin', 'BTC', 2, date)
      ]

      assert.deepEqual(
        BalanceManager.compareBalances(oldBalances, newBalances),
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
        new Balance('0x0', 'ethereum', 'ETH', 0, date),
        new Balance('0x1', 'iota', 'IOTA', 0, date)
      ]

      assert.deepEqual(
        BalanceManager.compareBalances(oldBalances, newBalances),
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
        new Balance('0x0', 'ethereum', 'ETH', 5, date),
        new Balance('0x1', 'iota', 'IOTA', 3, date),
        new Balance('0x2', 'bitcoin', 'BTC', 2, date)
      ]
      const newBalances = [
        new Balance('0x1', 'iota', 'IOTA', 1, date)
      ]

      assert.deepEqual(
        BalanceManager.compareBalances(oldBalances, newBalances),
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
        new Balance('0x0', 'ethereum', 'ETH', 5, date),
        new Balance('0x1', 'iota', 'IOTA', 5, date)
      ]
      const newBalances = [
        new Balance('0x2', 'bitcoin', 'BTC', 2, date)
      ]

      assert.deepEqual(
        BalanceManager.compareBalances(oldBalances, newBalances),
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
