<template>
  <main>
    <router-link :to="{ name: 'home' }"><img src="/static/logo.png" alt="AMW" class="main-logo" height="40" /></router-link>
    <app-menu />
    <app-indicators />
    <app-notifications />
    <section class="content">
      <article class="loading" v-if="loading">
        <h1>
          <fa-icon icon="sync-alt" :spin="true" />
          <translate>AllMyWallets is loading...</translate>
        </h1>
      </article>
      <router-view v-else />
      <app-footer v-if="!loading" />
    </section>
  </main>
</template>

<script>
  import AppMenu from './AppMenu.vue'
  import AppIndicators from './AppIndicators.vue'
  import AppFooter from './AppFooter.vue'
  import AppNotifications from './AppNotifications.vue'
  import Configurator from '../configurator'

  export default {
    name: 'app',
    components: {
      AppMenu,
      AppIndicators,
      AppNotifications,
      AppFooter
    },
    computed: {
      loading () {
        return this.$store.state.config.loading.app
      }
    },
    async mounted () {
      return this.$store.dispatch('init', {
        serviceWorker: this.$serviceWorker,
        config: await Configurator.getConfig()
      })
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
    overflow: hidden;
    position: relative;

    @media screen and (min-width: $breakpoint-medium) {
      grid-template-columns: 1fr $grid-notifications-width 0;
      grid-template-rows: $grid-header-height 1fr;
      grid-template-areas:
              "menu menu indicators"
              "content notifications notifications";
    }

    .content {
      grid-area: content;
      padding: 10px 10px 10px 20px;
      overflow-y: scroll;
      overflow-x: auto;
    }

    .main-logo {
      position: absolute;
      top: 5px;
      left: 20px;
      z-index: 10000;
    }

    article.loading {
      text-align: center;

      h1 {
        margin: 40px 0;
      }
    }
  }
</style>
