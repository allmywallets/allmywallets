import database from '../database'
import * as HoldingsManager from '../manager/holdings-manager'
import { collapseBalances } from '../manager/balance-manager'

const state = {
  loading: {
    balances: true
  },
  balances: [],
  pricesHistories: [] // Todo: holdings should be cached in database
}

const getters = {
  balances: (state, getters, rootState) => rootState.config.display.balances.collapsed ? collapseBalances(state.balances) : state.balances,
  pricesHistories: state => state.pricesHistories,
  globalHoldingsHistory: state => HoldingsManager.sumHoldingsHistories(HoldingsManager.computeAllHoldingsHistories(state.pricesHistories, state.balances)),
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
  UPDATE_PRICES_HISTORY (state, { pricesHistory }) {
    const index = state.pricesHistories.findIndex(history => pricesHistory.ticker === history.ticker)

    if (index === -1) {
      state.pricesHistories.push(pricesHistory)
    } else {
      state.pricesHistories.splice(index, 1, pricesHistory)
    }

    state.loading.priceHistories = false
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
   * Refreshes all the price histories
   */
  refreshPriceHistories: async ({ commit, rootState }) => {
    const balances = await database.findAllBalances()
    const tickers = [...new Set(balances.map(balance => balance.ticker))]

    const { primary, secondary } = rootState.config.config.profiles[0].application.currencies
    for (const ticker of tickers) {
      const pricesHistory = await HoldingsManager.getPeriodPriceHistory(ticker, primary, secondary)

      commit('UPDATE_PRICES_HISTORY', { ticker, pricesHistory })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
