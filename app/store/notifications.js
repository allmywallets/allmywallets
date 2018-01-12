const state = {
  notifications: []
}

const getters = {
  notifications: state => state.notifications
}

const mutations = {
  ADD_NOTIFICATION (state, { notification }) {
    if (notification.level === 'ERROR') {
      console.error(notification)
    }

    state.notifications.unshift(notification)
  },
  REMOVE_NOTIFICATION (state, { notification }) {
    state.notifications.splice(state.notifications.indexOf(notification), 1)
  },
  REMOVE_ALL_NOTIFICATIONS (state) {
    state.notifications = []
  }
}

const actions = {
  addNotification: ({ commit }, { notification }) => {
    commit('ADD_NOTIFICATION', { notification })
  },
  clearAllNotifications: ({ commit }) => {
    commit('REMOVE_ALL_NOTIFICATIONS')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
