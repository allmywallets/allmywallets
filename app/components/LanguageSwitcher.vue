<template>
  <span>
    <select name="language" @input="changeLanguage" title="Change language" class="language">
      <option v-for="(language, key) in $language.available" :value="key" :selected="key === $language.current">{{ language }}</option>
    </select>
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'language-switcher',
    computed: {
      ...mapGetters([
        'config'
      ])
    },
    methods: {
      changeLanguage (event) {
        this.$language.current = event.target.value

        const config = this.config
        config.application.language = this.$language.current

        return this.$store.dispatch('updateConfig', { config })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  select {
    width: 75px;
  }
</style>
