import Vue from 'vue'
import Configurator from '../configurator'
import { enablePushNotifications } from '../notification/subscription'
import { migrate } from '../migrations/config'

const state = {
  loading: {
    app: true, // Initial app loading
    wallets: false // Wallets changes
  },
  config: Configurator.getDefaultConfiguration(),
  version: { current: process.env.APP_VERSION, upstream: process.env.APP_VERSION },
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
  },
  APPLICATION_LOADED (state) {
    state.loading.app = false
  },
  APPLICATION_LOADING (state) {
    state.loading.app = true
  },
  CHECK_FOR_UPGRADE (state, version) {
    state.version = version
  },
  ADD_WALLET (state, wallet) {
    state.config.profiles[0].wallets.push(wallet)
    state.loading.wallets = false
  },
  CHANGE_LANGUAGE (state, language) {
    Vue.set(state.config.application, 'language', language)
    Vue.config.language = language
  },
  UPDATE_DISPLAY (state, display) {
    state.display = display
  }
}

const actions = {
  init: async ({ commit, dispatch }, { serviceWorker, config }) => {
    commit('INIT_APPLICATION', migrate(config))

    if (config.application.hasOwnProperty('language')) {
      commit('CHANGE_LANGUAGE', config.application.language)
    }

    dispatch('checkForUpgrade')

    if (!serviceWorker) { // No service worker; the app won't work
      return
    }

    const registration = await serviceWorker.getRegistration()
    if (registration) {
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await enablePushNotifications(serviceWorker)
      }
    }

    await dispatch('reloadAllBalances')
    commit('APPLICATION_LOADED')
    await dispatch('refreshPriceHistories')
  },
  checkForUpgrade: async ({ commit, state }) => {
    const version = await Configurator.getVersion()

    commit('CHECK_FOR_UPGRADE', version)

    return Configurator.setConfig(state.config)
  },
  appUpgrade: ({ commit }, { serviceWorker }) => {
    serviceWorker.controller.postMessage({
      action: 'app-upgrade'
    })

    commit('APPLICATION_LOADING')
  },
  addWallet: async ({ commit }, { wallet }) => {
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
