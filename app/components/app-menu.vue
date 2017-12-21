<template>
  <nav>
    <router-link :to="{ name: 'home' }"><icon icon="home"></icon></router-link>
    <router-link :to="{ name: 'add' }"><icon icon="plus"></icon></router-link>
    <router-link :to="{ name: 'settings' }"><icon icon="cog"></icon></router-link>
    <router-link to="#"><icon icon="heart"></icon></router-link>
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
    background: white;

    @media screen and (min-width: $breakpoint-medium) {
      flex-direction: column;
      justify-content: left;
    }

    a {
      padding: 0 2rem;
      font-size: 1.3rem;
      color: #3E3E3E;
      border-top: 3px solid transparent;
      display: flex;
      justify-content: center;
      flex-direction: column;

      @media screen and (min-width: $breakpoint-medium) {
        padding: 1rem 0;
        flex-direction: row;
      }

      &.router-link-exact-active {
        border-top: 3px solid #007bff;

        @media screen and (min-width: $breakpoint-medium) {
          border-top: 0;
          border-right: 3px solid #007bff;
        }
      }
    }
  }
</style>
