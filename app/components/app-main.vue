<template>
  <main>
    <app-navigation></app-navigation>
    <app-header></app-header>
    <span v-if="error">Error while loading service worker</span>
    <span v-if="offline">Offline</span>
    <a href="#" @click.prevent="enableNotifications()">enable notifs</a>
    <router-view></router-view>
  </main>
</template>

<script>
  import AppNavigation from './app-navigation.vue'
  import AppHeader from './app-header.vue'

  export default {
    name: 'app-main',
    data () {
      return {
        error: false,
        offline: false
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
      }
    },
    mounted () {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').catch(() => { this.error = true })
      }

      window.addEventListener('offline', () => { this.error = true })
    }
  }
</script>

<style lang="scss">
  @import '../scss/main';
</style>
