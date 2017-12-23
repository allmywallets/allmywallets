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
  import AppMenu from './app-menu.vue'
  import AppIndicators from './app-indicators.vue'
  import AppFooter from './app-footer.vue'
  import AppNotifications from './app-notifications.vue'

  export default {
    name: 'app-main',
    components: {
      AppMenu,
      AppIndicators,
      AppNotifications,
      AppFooter
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
