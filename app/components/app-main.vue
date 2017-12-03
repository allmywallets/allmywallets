<template>
  <main>
    <app-navigation></app-navigation>
    <app-header></app-header>
    <span v-if="error">Error while loading service worker</span>
    <span v-if="offline">Offline</span>
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
