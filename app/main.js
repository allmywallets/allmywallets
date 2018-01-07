import '@fortawesome/fontawesome-free-solid'

import Vue from 'vue'
import VueFilter from 'vue-filter'
import VueFormGenerator from 'vue-form-generator'
import VueTippy from 'vue-tippy'
import VueMoment from 'vue-moment'
import VueFontAwesome from '@fortawesome/vue-fontawesome'
import VueQRCode from '@xkeshi/vue-qrcode'

import router from './router'
import store from './store'
import App from './components/App.vue'

Vue.use(VueFilter)
Vue.use(VueFormGenerator)
Vue.use(VueTippy, {
  animation: 'shift-away',
  arrow: true,
  inertia: true
})
Vue.use(VueMoment)
Vue.component('icon', VueFontAwesome)
Vue.component('qrcode', VueQRCode)

Vue.prototype.$serviceWorker = navigator.serviceWorker

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
