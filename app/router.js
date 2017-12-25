import Vue from 'vue'
import Router from 'vue-router'
import PageHome from './components/page-home.vue'
import PageAddWallet from './components/page-add-wallet.vue'
import PageSettings from './components/page-settings.vue'
import PageConfigImport from './components/page-config-import.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: PageHome
    },
    {
      path: '/add',
      name: 'add',
      component: PageAddWallet
    },
    {
      path: '/stats',
      name: 'stats',
      component: PageHome
    },
    {
      path: '/settings',
      name: 'settings',
      component: PageSettings
    },
    {
      path: '/config/import',
      name: 'config-import',
      component: PageConfigImport
    },
    {
      path: '/config/import/:config',
      name: 'config-import-config',
      component: PageConfigImport
    },
    {
      path: '/contribute',
      name: 'contribute',
      component: PageHome
    }
  ]
})
