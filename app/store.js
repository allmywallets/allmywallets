import Vue from 'vue'
import Vuex from 'vuex'
import database from './database'
import Configurator from './configurator'

Vue.use(Vuex)

const state = {
  balances: [],
  configuration: {},
  errors: [],
  loading: false
}

const mutations = {
  INIT_APPLICATION (state, { configuration, balances }) {
    state.configuration = configuration
    state.balances = balances
  },
  ADD_WALLET (state, wallet) {
    state.configuration.profile[0].wallets.push(wallet)
  },
  UPDATE_CONFIGURATION (state, configuration) {
    state.configuration = configuration
  },
  REFRESH_BALANCE (state, balance, walletId) {
    state.balances[`${walletId}.${balance.currency}`] = balance
  },
  ADD_ERROR (state, error) {
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
    const balances = await database.getBalances()

    commit('INIT_APPLICATION', { configuration, balances })
  },
  addWallet: ({ dispatch }) => {
    dispatch('ADD_WALLET')
  },
  updateConfiguration: ({ dispatch }) => {
    dispatch('UPDATE_CONFIGURATION')
  },
  refreshBalance: ({ dispatch }) => {
    dispatch('REFRESH_BALANCE')
  },
  addError: ({ dispatch }) => {
    dispatch('ADD_ERROR')
  }
}

export default new Vuex.Store({ state, mutations, actions })
