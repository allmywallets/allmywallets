<template>
  <main>
    <app-navigation></app-navigation>
    <app-header></app-header>
    <span v-if="offline">Offline mode</span>
    <a href="#" @click.prevent="enableNotifications()">enable notifs</a><br />
    <a v-if="needsRefresh" href="#" @click.prevent="refreshPage">PLEASE REFRESH THE PAGE</a>
    <router-view></router-view>
  </main>
</template>

<script>
  import runtime from 'serviceworker-webpack-plugin/lib/runtime'
  import AppNavigation from './app-navigation.vue'
  import AppHeader from './app-header.vue'

  export default {
    name: 'app-main',
    data () {
      return {
        offline: false,
        needsRefresh: this.$serviceWorker.controller === null
      }
    },
    components: {
      AppNavigation,
      AppHeader
    },
    methods: {
      enableNotifications () {
        if ('Notification' in window) {
          if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
            Notification.requestPermission()
          }
        }
      },
      refreshPage () {
        location.reload()
      }
    },
    mounted () {
      runtime.register()
      this.$serviceWorker.addEventListener('controllerchange', () => {
        this.needsRefresh = this.$serviceWorker.controller === null
      })
      window.addEventListener('offline', () => { this.offline = true })
    }
  }
</script>

<style lang="scss">
  @import '../scss/main';
</style>
