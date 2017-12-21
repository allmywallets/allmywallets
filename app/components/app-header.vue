<template>
  <header>
    <header-indicators></header-indicators>
  </header>
</template>

<script>
  import HeaderIndicators from './header-indicators.vue'

  export default {
    name: 'app-header',
    components: {
      HeaderIndicators
    }
  }
</script>

<style scoped lang="scss">
  header {
    grid-area: header;
  }
</style>
