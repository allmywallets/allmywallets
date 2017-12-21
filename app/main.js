import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import VueFontAwesome from '@fortawesome/vue-fontawesome'
import '@fortawesome/fontawesome-free-solid'
import router from './router'
import AppMain from './components/app-main.vue'

Vue.use(VueFormGenerator)
Vue.component('icon', VueFontAwesome)

Vue.prototype.$serviceWorker = navigator.serviceWorker

new Vue({
  router,
  render: h => h(AppMain)
}).$mount('#app-main')
