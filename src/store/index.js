import Vue from 'vue'
import Vuex from 'vuex'
import config from './config'
import balances from './balances'
import notifications from './notifications'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    config,
    balances,
    notifications,
    modules
  }
})
