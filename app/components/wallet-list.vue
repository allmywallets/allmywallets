<template>
  <section>
    <wallet
            v-for="wallet, key in wallets"
            :key="key"
            :currency="wallet.currency"
            :provider="wallet.provider"
            :parameters="wallet.parameters"
    ></wallet>
  </section>
</template>

<script>
  import Wallet from './wallet.vue'

  export default {
    name: 'wallet-list',
    data () {
      return {
        wallets: []
      }
    },
    components: {
      Wallet
    },
    mounted () {
      this.wallets = JSON.parse(localStorage['configuration']).profiles[0].wallets
    }
  }
</script>
