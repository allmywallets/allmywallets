<template>
  <footer class="app-footer">
    AllMyWallets &bull; v{{ currentVersion }} &bull; <router-link :to="{ name: 'home-upgraded' }" v-translate>Release notes</router-link>
    <template v-if="needsUpgrade">
      &bull; <router-link to="settings" v-translate>An upgrade is available!</router-link>
    </template>
    &bull;
    <language-switcher />
  </footer>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LanguageSwitcher from './LanguageSwitcher'

  export default {
    name: 'app-footer',
    components: {
      LanguageSwitcher
    },
    computed: {
      ...mapGetters([
        'currentVersion',
        'needsUpgrade'
      ])
    }
  }
</script>

<style scoped lang="scss">
  .app-footer {
    padding: 10px 20px;
    font-size: 0.8em;
    text-align: center;
  }
</style>
