import Vue from 'vue'
import VueFilter from 'vue-filter'
import VueFormGenerator from 'vue-form-generator'
import VueTippy from 'vue-tippy'
import VueMoment from 'vue-moment'
import SweetModal from 'sweet-modal-vue/src/plugin'
import VueI18n from 'vue-i18n'
import '@fortawesome/fontawesome-free-brands'
import '@fortawesome/fontawesome-free-solid'
import VueFontAwesome from '@fortawesome/vue-fontawesome'
import VueQRCode from '@xkeshi/vue-qrcode'

import { locale, messages } from './translator'
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
Vue.use(SweetModal)
Vue.use(VueI18n)
Vue.component('fa-icon', VueFontAwesome)
Vue.component('qrcode', VueQRCode)

Vue.prototype.$serviceWorker = navigator.serviceWorker

const i18n = new VueI18n({
  locale: locale(),
  fallbackLocale: 'en',
  messages
})

new Vue({
  store,
  router,
  render: h => h(App),
  i18n
}).$mount('#app')
