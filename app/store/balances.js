import database from '../database'
import * as HoldingsManager from '../manager/holdings-manager'
import Balance from '../model/Balance'
import Wallet from '../model/Wallet'

const state = {
  loading: {
    balances: true,
    holdings: true
  },
  balances: [],
  holdings: {} // Todo: holdings should be cached in database
}

const getters = {
  balances: state => state.balances,
  collapsedBalances: state => { // Todo: extract this in balance manager
    const collapsed = {}

    state.balances.forEach(balance => {
      if (balance.currency in collapsed) {
        const existingBalance = collapsed[balance.currency]

        existingBalance.increaseAmount(balance.amount)
        existingBalance.lastUpdate = balance.lastUpdate < existingBalance.lastUpdate ? balance.lastUpdate : existingBalance.lastUpdate
        let nbWallets = existingBalance.wallet.name.replace(/.*\D/g, '')
        existingBalance.wallet.name = `${++nbWallets} wallets`
        existingBalance.wallet.network = existingBalance.wallet.network === balance.wallet.network ? balance.wallet.network : 'Multiple networks'
        existingBalance.wallet.provider = existingBalance.wallet.provider === balance.wallet.provider ? balance.wallet.provider : 'multiple providers'
      } else {
        const aggregateWallet = new Wallet(balance.currency, '1 wallet', balance.wallet.network, balance.wallet.provider)
        collapsed[balance.currency] = new Balance(aggregateWallet, '', balance.currency, balance.ticker, balance.amount, balance.lastUpdate)
      }
    })
  },
  holdings: state => state.holdings,
  totalHoldings: state => HoldingsManager.sumHoldingsHistories(state.holdings)
}

const mutations = {
  UPDATE_BALANCES (state, { balances }) {
    balances.forEach(updatedBalance => {
      const index = state.balances.findIndex(balance => updatedBalance.equals(balance))

      if (index === -1) {
        state.balances.push(updatedBalance)
      } else {
        state.balances.splice(index, 1, updatedBalance)
      }
    })

    state.loading.balances = false
  },
  BALANCES_LOADING (state) {
    state.loading.balances = true
  },
  UPDATE_HOLDINGS (state, { holdings }) {
    state.holdings = holdings
    state.loading.holdings = false
  }
}

const actions = {
  /**
   * Reloads all balances from database.
   */
  reloadAllBalances: async ({ commit }) => {
    const balances = await database.findAllBalances()

    commit('UPDATE_BALANCES', { balances })
  },

  /**
   * Reloads specified balances from database.
   */
  reloadBalances: async ({ commit }, { balanceIds }) => {
    const balances = await database.findBalances(balanceIds)

    commit('UPDATE_BALANCES', { balances })
  },

  /**
   * Tells the service worker to refresh balances of each wallet.
   */
  refreshBalances: ({ commit }, { wallets, serviceWorker }) => {
    wallets.forEach(wallet => {
      serviceWorker.controller.postMessage({
        action: 'balance-refresh',
        walletId: wallet.id,
        currencies: []
      })
    })

    commit('BALANCES_LOADING')
  },

  /**
   * Refreshes all the holdings from balances in database
   */
  refreshHoldings: async ({ commit }) => {
    const balances = await database.findAllBalances()
    const amounts = HoldingsManager.getSummedAmounts(balances)

    const priceHistories = {}
    for (const ticker in amounts) {
      priceHistories[ticker] = await HoldingsManager.getPeriodPriceHistory(ticker) // Todo: commit UPDATE EXCHANGE VALUES
    }

    const holdings = {}
    for (const ticker in priceHistories) {
      holdings[ticker] = HoldingsManager.computeHoldingsHistory(priceHistories[ticker], [...new Array(priceHistories[ticker].length).keys()].map(() => amounts[ticker]))
    }

    commit('UPDATE_HOLDINGS', { holdings })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
