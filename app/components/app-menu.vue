<template>
  <nav>
    <router-link :to="{ name: 'home' }">
        <icon icon="home"></icon> <span class="title">All My Wallets</span>
    </router-link>
    <router-link :to="{ name: 'stats' }">
        <icon icon="chart-pie"></icon> <span class="title">Statistics</span>
    </router-link>
    <router-link :to="{ name: 'settings' }">
        <icon icon="cog"></icon> <span class="title">Settings</span>
    </router-link>
    <router-link to="#">
        <icon icon="heart"></icon> <span class="title">Contribute</span>
    </router-link>
  </nav>
</template>

<script>
  export default {
    name: 'app-menu'
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  nav {
    grid-area: menu;
    display: flex;
    justify-content: center;
    box-shadow: 0 0 3px rgba(#000000, .3);
    background: $color-section-menu;
    z-index: 1000;

    @media screen and (min-width: $breakpoint-medium) {
      justify-content: center;
      padding-right: $grid-notifications-width;
    }

    a {
      padding: 0 1.5rem;
      font-size: 1.5rem;
      color: $color-section-notifications;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .title {
        display: none;

        @media screen and (min-width: $breakpoint-medium) {
          display: inline-block;
        }
      }

      @media screen and (min-width: $breakpoint-medium) {
        font-size: 0.7rem;

        svg {
          margin: 0 auto 3px;
          font-size: 1.4rem;
        }
      }

      &.router-link-exact-active {
        color: white;
        font-weight: bold;
      }
    }
  }
</style>
