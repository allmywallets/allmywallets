import Vue from 'vue'
import Vuex from 'vuex'
import database from './database'
import Configurator from './configurator'

Vue.use(Vuex)

const state = {
  balances: [],
  configuration: {},
  errors: []
}

const mutations = {
  INIT_APPLICATION (state, { configuration, balances }) {
    state.configuration = configuration
    state.balances = balances
  },
  ADD_WALLET (state, wallet) {
    state.configuration.profiles[0].wallets.push(wallet)
  },
  UPDATE_CONFIGURATION (state, { configuration }) {
    state.configuration = configuration
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
    const configuration = await Configurator.getConfiguration()
    const balances = await database.findAllBalances()

    commit('INIT_APPLICATION', { configuration, balances })
  },
  addWallet: ({ commit }) => {
    commit('ADD_WALLET')
  },
  updateConfiguration: async ({ commit }, configuration) => {
    await Configurator.setConfiguration(configuration) // Todo: reset all balances and re-init app

    commit('UPDATE_CONFIGURATION', { configuration })
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
