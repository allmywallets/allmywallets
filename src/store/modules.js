import { loadModules } from '../manager/modules'

const state = {
  modules: [],
  loading: {
    modules: true
  }
}

const getters = {
  menuRoutes: state => {
    let routes = []

    state.modules.forEach(module => {
      routes = [...routes, ...module.routes.filter(route => route.menu)]
    })

    return routes
  }
}

const mutations = {
  MODULES_LOADED (state, modules) {
    modules.forEach(module => {
      state.modules.push(module)
    })

    state.loading.modules = false
  }
}

const actions = {
  loadModules: async ({ commit }) => {
    const modules = await loadModules()

    commit('MODULES_LOADED', modules)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
