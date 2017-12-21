<template>
  <main>
    <app-menu></app-menu>
    <app-header></app-header>
    <app-notifications></app-notifications>
    <router-view class="content"></router-view>
    <app-footer></app-footer>
  </main>
</template>

<script>
  import AppMenu from './app-menu.vue'
  import AppHeader from './app-header.vue'
  import AppFooter from './app-footer.vue'
  import AppNotifications from './app-notifications.vue'

  export default {
    name: 'app-main',
    components: {
      AppMenu,
      AppHeader,
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
    grid-template-areas:
            "header"
            "content"
            "footer"
            "menu";
    
    @media screen and (min-width: $breakpoint-medium) {
      grid-template-columns: 60px 1fr 250px;
      grid-template-rows: auto auto auto;
      grid-template-areas:
              "menu header notifications"
              "menu content notifications"
              "menu footer notifications";
    }
    
    .content {
      grid-area: content;
      overflow: auto;
    }
  }
</style>
