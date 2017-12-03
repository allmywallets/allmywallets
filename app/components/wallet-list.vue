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
  import Storage from '../storage'
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
      this.wallets = Storage.configuration.profiles[0].wallets
    }
  }
</script>
