import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import VueFontAwesome from '@fortawesome/vue-fontawesome'
import VueTippy from 'vue-tippy'
import VueFilter from 'vue-filter'
import '@fortawesome/fontawesome-free-solid'

import router from './router'
import store from './store'
import AppMain from './components/app-main.vue'

Vue.use(VueFilter)
Vue.use(VueFormGenerator)
Vue.use(VueTippy, {
  animation: 'fade',
  arrow: true
})
Vue.component('icon', VueFontAwesome)

Vue.prototype.$serviceWorker = navigator.serviceWorker

new Vue({
  store,
  router,
  render: h => h(AppMain)
}).$mount('#app-main')
