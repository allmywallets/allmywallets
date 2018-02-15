import Vue from 'vue'
import VueFilter from 'vue-filter'
import Vue2Filters from 'vue2-filters'
import VueFormGenerator from 'vue-form-generator'
import VueTippy from 'vue-tippy'
import VueMoment from 'vue-moment'
import SweetModal from 'sweet-modal-vue/src/plugin'
import VueGetText from 'vue-gettext'
import '@fortawesome/fontawesome-free-brands'
import '@fortawesome/fontawesome-free-solid'
import VueFontAwesome from '@fortawesome/vue-fontawesome'
import VueQRCode from '@xkeshi/vue-qrcode'

import { locale, translations, getAvailableLanguages } from './src/manager/translator'
import router from './src/router'
import store from './src/store/index'
import Filters from './src/filters'
import App from './components/App.vue'

Vue.use(VueFilter)
Vue.use(Vue2Filters)
Vue.use(Filters)
Vue.use(VueFormGenerator)
Vue.use(VueTippy, {
  animation: 'shift-away',
  arrow: true,
  inertia: true
})
Vue.use(VueMoment)
Vue.use(SweetModal)
Vue.use(VueGetText, {
  availableLanguages: getAvailableLanguages(),
  defaultLanguage: locale(),
  translations: translations,
  silent: true
})
Vue.component('fa-icon', VueFontAwesome)
Vue.component('qrcode', VueQRCode)

Vue.prototype.$serviceWorker = navigator.serviceWorker

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
