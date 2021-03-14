<template>
  <footer class="app-footer">
    AllMyWallets &middot; v{{ currentVersion }} &middot;
    <router-link :to="{ name: 'home-upgraded' }" v-translate
      >Release notes</router-link
    >
    <template v-if="needsUpgrade">
      &middot;
      <router-link to="settings" v-translate
        >An upgrade is available!</router-link
      >
    </template>
    &middot;
    <language-switcher />
    <br />
    <translate
      >Software is provided without warranty: AllMyWallets and its contributors
      cannot be held liable for damages.</translate
    >
    &middot;
    <a
      href="https://github.com/allmywallets/allmywallets/blob/master/LICENSE"
      target="_blank"
      rel="noopener"
      v-translate
      >MIT License</a
    >
  </footer>
</template>

<script>
import { mapGetters } from "vuex"
import LanguageSwitcher from "./LanguageSwitcher"

export default {
  name: "app-footer",
  components: {
    LanguageSwitcher
  },
  computed: {
    ...mapGetters(["currentVersion", "needsUpgrade"])
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
