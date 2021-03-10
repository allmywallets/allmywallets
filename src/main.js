import Vue from 'vue'
import VueFilter from 'vue-filter'
import Vue2Filters from 'vue2-filters'
import VueFormGenerator from 'vue-form-generator'
import VueTippy from 'vue-tippy'
import SweetModal from 'sweet-modal-vue/src/plugin'
import VueGetText from 'vue-gettext'
import FontAwesome from '@fortawesome/fontawesome'
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'
import faSolid from '@fortawesome/fontawesome-free-solid'
import VueFontAwesome from '@fortawesome/vue-fontawesome'
import VueQRCode from '@xkeshi/vue-qrcode'

import { locale, translations, getAvailableLanguages } from './manager/translator'
import router from './router'
import store from './store'
import Filters from './filters'
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
Vue.use(SweetModal)
Vue.use(VueGetText, {
  availableLanguages: getAvailableLanguages(),
  defaultLanguage: locale(),
  translations: translations,
  silent: true
})

FontAwesome.library.add(faGithub, faSolid)

Vue.component('fa-icon', VueFontAwesome)
Vue.component('qrcode', VueQRCode)

Vue.prototype.$serviceWorker = navigator.serviceWorker

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
