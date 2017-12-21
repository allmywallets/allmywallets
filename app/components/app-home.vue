<template>
  <div>
    <h2>All My Wallets</h2>
    <wallet-list></wallet-list>
  </div>
</template>

<script>
  import WalletList from './wallet-list.vue'

  export default {
    name: 'app-home',
    components: {
      WalletList
    }
  }
</script>
