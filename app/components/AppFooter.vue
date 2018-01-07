<template>
  <footer class="app-footer">
    AllMyWallets &bull; v{{ currentVersion }}
    <template v-if="needsUpgrade">
      &bull; <router-link to="settings">An upgrade is available!</router-link>
    </template>
  </footer>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'app-footer',
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
