import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import router from './router'
import AppMain from './components/app-main.vue'

Vue.use(VueFormGenerator)

Vue.prototype.$serviceWorker = navigator.serviceWorker

new Vue({
  router,
  render: h => h(AppMain)
}).$mount('#app-main')
