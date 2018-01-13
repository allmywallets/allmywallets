import Vue from 'vue'
import Router from 'vue-router'
import PageHome from './components/PageHome.vue'
import PageAddWallet from './components/PageAddWallet.vue'
import PageStatistics from './components/PageStatistics.vue'
import PageSettings from './components/PageSettings.vue'
import PageContribute from './components/PageContribute.vue'

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
      path: '/upgraded',
      name: 'home-upgraded',
      component: PageHome
    },
    {
      path: '/add',
      name: 'home-add',
      component: PageAddWallet
    },
    {
      path: '/stats',
      name: 'stats',
      component: PageStatistics
    },
    {
      path: '/settings',
      name: 'settings',
      component: PageSettings
    },
    {
      path: '/settings/:config',
      name: 'settings-import',
      component: PageSettings
    },
    {
      path: '/contribute',
      name: 'contribute',
      component: PageContribute
    }
  ]
})
