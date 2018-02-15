<template>
  <span>
    <select name="language" @change="changeLanguage" title="Change language" class="language">
      <option v-for="(language, key) in $language.available" :value="key" :key="key" :selected="key === $language.current">
        {{ language }}
      </option>
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
        return this.$store.dispatch('changeLanguage', {
          language: event.target.value
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/scss/vars';

  select {
    width: 75px;
    height: 20px;
    vertical-align: middle;
    padding: 1px 0;
  }
</style>
