<template>
  <main>
    <app-menu></app-menu>
    <app-indicators></app-indicators>
    <app-notifications></app-notifications>
    <section class="content">
      <router-view></router-view>
      <app-footer></app-footer>
    </section>
  </main>
</template>

<script>
  import AppMenu from './AppMenu.vue'
  import AppIndicators from './AppIndicators.vue'
  import AppFooter from './AppFooter.vue'
  import AppNotifications from './AppNotifications.vue'

  export default {
    name: 'app',
    components: {
      AppMenu,
      AppIndicators,
      AppNotifications,
      AppFooter
    },
    mounted () {
      const serviceWorker = this.$serviceWorker

      return this.$store.dispatch('initApplication', { serviceWorker })
    }
  }
</script>

<style lang="scss">
  @import '../scss/vars';
  @import '../scss/main';

  main {
    display: grid;
    height: 100vh;
    grid-template-rows: $grid-header-height 1fr $grid-header-height;
    grid-template-areas:
            "indicators"
            "content"
            "menu";
    
    @media screen and (min-width: $breakpoint-medium) {
      grid-template-columns: 1fr $grid-notifications-width 0;
      grid-template-rows: $grid-header-height 1fr;
      grid-template-areas:
              "menu menu indicators"
              "content notifications notifications";
    }
    
    .content {
      grid-area: content;
      padding: 10px 20px;
      overflow: auto;
    }
  }
</style>
