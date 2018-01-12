import database from '../database'
import { computeHoldings } from '../manager/holdings-manager'

const state = {
  loading: {
    balances: true,
    holdings: true
  },
  balances: [],
  holdings: [] // Todo: holdings should be cached in database
}

const getters = {
  balances: state => state.balances,
  holdings: state => state.holdings
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
    const holdings = await computeHoldings(balances)

    commit('UPDATE_HOLDINGS', { holdings })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
