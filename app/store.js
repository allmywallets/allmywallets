import Vue from 'vue'
import Vuex from 'vuex'
import database from './database'
import Configurator from './configurator'

Vue.use(Vuex)

const state = {
  balances: [],
  config: {},
  errors: []
}

const mutations = {
  INIT_APPLICATION (state, { config, balances }) {
    state.config = config
    state.balances = balances
  },
  ADD_WALLET (state, wallet) {
    state.config.profiles[0].wallets.push(wallet)
  },
  UPDATE_CONFIG (state, { config }) {
    state.config = config
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
  },
  ADD_ERROR (state, { error }) {
    console.error(error)
    state.errors.push(error)
  },
  REMOVE_ERROR (state, error) {
    state.errors.splice(state.errors.indexOf(error), 1)
  }
}

const actions = {
  initApplication: async ({ commit }) => {
    const config = await Configurator.getConfig()
    const balances = await database.findAllBalances()

    commit('INIT_APPLICATION', { config: config, balances })
  },
  addWallet: ({ commit }) => {
    commit('ADD_WALLET')
  },
  updateConfig: async ({ commit }, { config }) => {
    await Configurator.setConfig(config) // Todo: reset all balances and re-init app

    commit('UPDATE_CONFIG', { config: config })
  },
  reloadBalances: async ({ commit }, { balanceIds }) => {
    const balances = await database.findBalances(balanceIds)

    commit('RELOAD_BALANCES', { balances })
  },
  addError: ({ commit }, { error }) => {
    commit('ADD_ERROR', { error })
  }
}

export default new Vuex.Store({ state, mutations, actions })
