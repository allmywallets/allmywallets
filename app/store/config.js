import Configurator from '../configurator'
import { enablePushNotifications } from '../notification/subscription'

const state = {
  loading: {
    app: true, // Initial app loading
    wallets: false // Wallets changes
  },
  config: { profiles: [{ wallets: [] }] },
  version: { current: 'unknown', upstream: 'unknown' },
  display: {
    balances: {
      charts: false // Todo: move this in config
    },
    notifications: {
      panel: false
    }
  }
}

const getters = {
  config: state => state.config,
  wallets: state => state.config.profiles[0].wallets,
  needsUpgrade: state => state.version.current !== state.version.upstream,
  currentVersion: state => state.version.current,
  display: state => state.display
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
  UPDATE_DISPLAY (state, { display }) {
    state.display = display
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
      dispatch('refreshPriceHistories')
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
  updateDisplay: async ({ commit }, { display }) => {
    commit('UPDATE_DISPLAY', { display })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
