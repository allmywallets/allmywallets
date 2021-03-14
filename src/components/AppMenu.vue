<template>
  <nav class="app-menu" role="navigation">
    <router-link
      :to="{ name: 'home' }"
      :class="{
        'router-link-exact-active':
          $route.name && $route.name.startsWith('home')
      }"
    >
      <fa-icon icon="home" /> <span class="title">AllMyWallets</span>
    </router-link>
    <router-link :to="{ name: 'settings' }">
      <fa-icon icon="cog" /> <span class="title" v-translate>Settings</span>
    </router-link>
    <router-link :to="{ name: 'contribute' }">
      <fa-icon icon="heart" /> <span class="title" v-translate>Contribute</span>
    </router-link>
    <router-link
      :to="{ name: route.router.name }"
      v-for="route in menuRoutes"
      :key="route.router.name"
    >
      <fa-icon :icon="route.icon" />
      <span class="title">{{ route.title }}</span>
    </router-link>
    <a href="#" class="loading" v-if="loadingRoutes">
      <fa-icon icon="spinner" spin />
      <span class="title">Loading modules...</span>
    </a>
  </nav>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "app-menu",
  data() {
    return {
      modules: []
    }
  },
  computed: {
    ...mapGetters(["menuRoutes"]),
    loadingRoutes() {
      return this.$store.state.modules.loading.modules
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/vars";

.app-menu {
  grid-area: menu;
  display: flex;
  justify-content: center;
  box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.15);
  background: $color-section-menu;
  z-index: 1000;

  @media screen and (min-width: $breakpoint-medium) {
    justify-content: center;
    padding-right: $grid-notifications-width;
    background: $color-section-indicators;
  }

  a {
    padding: 0 1.5rem;
    font-size: 1.5rem;
    color: $color-secondary;
    display: flex;
    justify-content: center;
    flex-direction: column;

    &.router-link-exact-active {
      color: $color-primary;
    }

    &.loading {
      pointer-events: none;
    }

    @media screen and (min-width: $breakpoint-medium) {
      font-size: 0.8rem;
      font-weight: bold;

      &.router-link-exact-active {
        color: white;
      }

      svg {
        margin: 2px auto;
        font-size: 1.5rem;
      }
    }

    .title {
      display: none;

      @media screen and (min-width: $breakpoint-medium) {
        display: inline-block;
      }
    }
  }
}
</style>
