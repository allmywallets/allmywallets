<template>
  <div>
    <h3>Credits</h3>
    <p>This app uses awesome tools from the cryptocurrencies space!</p>
    <ul class="providers">
      <li>
        <a href="https://www.cryptocompare.com/">Cryptocompare</a> - For price history
      </li>
      <li>
        <a href="https://github.com/cjdowner/cryptocurrency-icons">Cryptocurrency Icons, by cjdowner</a> - For balance icons
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
