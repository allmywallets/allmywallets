<template>
  <main>
    <app-menu></app-menu>
    <app-header></app-header>
    <router-view></router-view>
  </main>
</template>

<script>
  import AppMenu from './app-menu.vue'
  import AppHeader from './app-header.vue'

  export default {
    name: 'app-main',
    components: {
      AppMenu,
      AppHeader
    }
  }
</script>

<style lang="scss">
  @import '../scss/main';
</style>
