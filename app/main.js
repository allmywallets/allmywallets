import Vue from 'vue'
import router from './router'
import AppMain from './components/app-main.vue'

Vue.prototype.$serviceWorker = navigator.serviceWorker

new Vue({
  router,
  render: h => h(AppMain)
}).$mount('#app-main')
