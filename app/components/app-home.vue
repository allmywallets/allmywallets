<template>
  <div>
    <h2>All My Wallets</h2>
    <balance-list></balance-list>
  </div>
</template>

<script>
  import BalanceList from './balance-list.vue'

  export default {
    name: 'app-home',
    components: {
      BalanceList
    }
  }
</script>
