<template>
  <div>
    <h2 v-translate>Credits</h2>
    <p v-translate>This app uses awesome tools from the cryptocurrencies space!</p>
    <ul class="providers">
      <li>
        <a href="https://www.cryptocompare.com/">Cryptocompare</a> - <translate>For price history</translate>
      </li>
      <li>
        <a href="https://github.com/cjdowner/cryptocurrency-icons">Cryptocurrency Icons, by cjdowner</a> - <translate>For balance icons</translate>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'providers-credits'
  }
</script>

<style scoped lang="scss">
  .providers {
    text-align: left;
  }
</style>
