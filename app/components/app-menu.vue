<template>
  <nav>
    <router-link :to="{ name: 'home' }">
        <icon icon="home"></icon> <span class="title">All My Wallets</span>
    </router-link>
    <router-link :to="{ name: 'add' }">
        <icon icon="plus"></icon> <span class="title">Add a wallet</span>
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
    background: linear-gradient(to bottom, #ffffff 0%, #f6f6f6 100%);
    z-index: 1000;

    @media screen and (min-width: $breakpoint-medium) {
      justify-content: center;
    }

    a {
      padding: 0 2rem;
      font-size: 1.3rem;
      color: $color-section-notifications;
      border-top: 3px solid transparent;
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
        svg {
          color: $color-info;
        }
      }
    }
  }
</style>
