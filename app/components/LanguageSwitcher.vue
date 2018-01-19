<template>
  <span>
    <select name="language" v-model="$language.current" title="Change language">
      <option v-for="(language, key) in $language.available" :value="key">{{ language }}</option>
    </select>
  </span>
</template>

<script>
  export default {
    name: 'language-switcher'
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  select {
    width: 75px;
  }
</style>
