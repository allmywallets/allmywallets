import Vue from 'vue'
import router from './router'
import AppMain from './components/app-main.vue'

navigator.serviceWorker.register('/service-worker.js')

new Vue({
  router,
  render: h => h(AppMain)
}).$mount('#app-main')
