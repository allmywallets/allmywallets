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
    min-width: 100%;
    grid-template-columns: 60px auto;
    grid-template-areas:
            "header header"
            "menu content"
            "menu footer";
    
    @media screen and (min-width: $breakpoint-medium) {
      grid-template-columns: 75px auto 200px;
      grid-template-areas:
              "header header header"
              "menu content notifications"
              "menu footer notifications";
    }
    
    .content {
      grid-area: content;
      background: lightcoral;
    }
  }
</style>
