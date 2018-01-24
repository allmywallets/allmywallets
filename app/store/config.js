import Vue from 'vue'
import Configurator from '../configurator'
import { enablePushNotifications } from '../notification/subscription'

const state = {
  loading: {
    app: true, // Initial app loading
    wallets: false // Wallets changes
  },
  config: Configurator.getDefaultConfiguration(),
  version: { current: 'unknown', upstream: 'unknown' },
  display: {
    balances: {
      charts: false,
      collapsed: false
    },
    notifications: {
      panel: false
    }
  }
}

const getters = {
  config: state => state.config,
  currencies: state => state.config.profiles[0].application.currencies,
  wallets: state => state.config.profiles[0].wallets,
  needsUpgrade: state => state.version.current !== state.version.upstream,
  currentVersion: state => state.version.current,
  display: state => state.display
}

const mutations = {
  INIT_APPLICATION (state, config) {
    state.config = config
    state.loading.app = false
  },
  CHECK_FOR_UPDATES (state, version) {
    state.version = version

    if (state.config.application.version === 'unknown') {
      state.config.application.version = version.current
    }
  },
  ADD_WALLET (state, wallet) {
    state.config.profiles[0].wallets.push(wallet)
    state.loading.wallets = false
  },
  CHANGE_LANGUAGE (state, language) {
    state.config.application.language = language
    Vue.config.language = language
  },
  UPDATE_DISPLAY (state, display) {
    state.display = display
  }
}

const actions = {
  init: async ({ commit, dispatch }, { serviceWorker, config }) => {
    const registration = await serviceWorker.getRegistration()

    if (registration) {
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await enablePushNotifications(serviceWorker)
      }
    }

    commit('INIT_APPLICATION', config)

    dispatch('checkForUpdates')
    dispatch('reloadAllBalances').then(() => {
      dispatch('refreshPriceHistories')
    })
  },
  checkForUpdates: async ({ commit, state }) => {
    const version = await Configurator.getVersion()

    commit('CHECK_FOR_UPDATES', version)

    return Configurator.setConfig(state.config)
  },
  addWallet: async ({ commit }, { wallet }) => { // Todo use this method
    await Configurator.validateWalletConfig(wallet)

    commit('ADD_WALLET', wallet)

    return Configurator.setConfig(state.config)
  },
  changeLanguage: ({ commit }, { language }) => {
    commit('CHANGE_LANGUAGE', language)

    return Configurator.setConfig(state.config)
  },
  updateDisplay: async ({ commit }, { display }) => {
    commit('UPDATE_DISPLAY', display)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
