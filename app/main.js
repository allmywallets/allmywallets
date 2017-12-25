import '@fortawesome/fontawesome-free-solid'

import Vue from 'vue'
import VueFilter from 'vue-filter'
import VueFormGenerator from 'vue-form-generator'
import VueTippy from 'vue-tippy'
import VueFontAwesome from '@fortawesome/vue-fontawesome'
import VueQRCode from '@xkeshi/vue-qrcode'

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
Vue.component('qrcode', VueQRCode)

Vue.prototype.$serviceWorker = navigator.serviceWorker

new Vue({
  store,
  router,
  render: h => h(AppMain)
}).$mount('#app-main')
