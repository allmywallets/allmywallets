import Vue from 'vue'
import Vuex from 'vuex'
import database from './database'
import Configurator from './configurator'
import { enablePushNotifications } from './notification/subscription'
import { computeHoldings } from './manager/holdings-manager'

Vue.use(Vuex)

const state = {
  loading: {
    app: true, // Initial app loading
    balances: true, // Balances refresh
    wallets: false, // Wallets changes
    holdings: true // Holdings refresh
  },
  balances: [],
  config: { profiles: [{ wallets: [] }] },
  notifications: [],
  version: { current: 'unknown', upstream: 'unknown' },
  holdings: []
}

const getters = {
  wallets: state => state.config.profiles[0].wallets,
  balances: state => state.balances,
  needsUpgrade: state => state.version.current !== state.version.upstream,
  currentVersion: state => state.version.current,
  holdings: state => state.holdings,
  loading: state => state.loading
}

const mutations = {
  INIT_APPLICATION (state, { config }) {
    state.config = config
    state.loading.app = false
  },
  CHECK_FOR_UPDATES (state, { version }) {
    state.version = version
  },
  ADD_WALLET (state, wallet) {
    state.config.profiles[0].wallets.push(wallet)
    state.loading.wallets = false
  },
  UPDATE_CONFIG (state, { config }) {
    state.config = config
  },
  UPDATE_HOLDINGS (state, { holdings }) {
    state.holdings = holdings
    state.loading.holdings = false
  },
  RELOAD_BALANCES (state, { balances }) {
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
  REFRESH_BALANCES (state) {
    state.loading.balances = true
  },
  ADD_NOTIFICATION (state, { notification }) {
    if (notification.level === 'ERROR') {
      console.error(notification)
    }

    state.notifications.unshift(notification)
  },
  CLEAR_NOTIFICATION (state, { notification }) {
    state.notifications.splice(state.notifications.indexOf(notification), 1)
  },
  CLEAR_ALL_NOTIFICATIONS (state) {
    state.notifications = []
  }
}

const actions = {
  initApplication: async ({ commit, dispatch }, { serviceWorker }) => {
    const config = await Configurator.getConfig()

    const registration = await serviceWorker.getRegistration()

    if (registration) {
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await enablePushNotifications(serviceWorker)
      }
    }

    commit('INIT_APPLICATION', { config })

    dispatch('checkForUpdates')
    dispatch('reloadAllBalances').then(() => {
      dispatch('updateHoldings')
    })
  },
  checkForUpdates: async ({ commit }) => {
    const version = await Configurator.getVersion()

    commit('CHECK_FOR_UPDATES', { version })
  },
  addWallet: ({ commit }) => { // Todo
    commit('ADD_WALLET')
  },
  updateConfig: async ({ commit }, { config }) => {
    await Configurator.setConfig(config) // Todo: reset all balances and re-init app

    commit('UPDATE_CONFIG', { config })
  },
  reloadAllBalances: async ({ commit }) => {
    const balances = await database.findAllBalances()

    commit('RELOAD_BALANCES', { balances })
  },
  refreshBalances: ({ commit }, { wallets, serviceWorker }) => {
    wallets.forEach(wallet => {
      serviceWorker.controller.postMessage({
        action: 'balance-refresh',
        walletId: wallet.id,
        currencies: []
      })
    })

    commit('REFRESH_BALANCES')
  },
  reloadBalances: async ({ commit }, { balanceIds }) => {
    const balances = await database.findBalances(balanceIds)

    commit('RELOAD_BALANCES', { balances })
  },
  updateHoldings: async ({ commit }) => {
    const balances = await database.findAllBalances()
    const holdings = await computeHoldings(balances)

    commit('UPDATE_HOLDINGS', { holdings })
  },
  addNotification: ({ commit }, { notification }) => {
    commit('ADD_NOTIFICATION', { notification })
  },
  clearAllNotifications: ({ commit }) => {
    commit('CLEAR_ALL_NOTIFICATIONS')
  }
}

export default new Vuex.Store({ state, getters, mutations, actions })
