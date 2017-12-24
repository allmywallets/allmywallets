<template>
  <div>
    <h2>All My Wallets</h2>
    <a href="#" @click.prevent="refreshBalances">refresh all</a> &bull;
    <router-link :to="{ name: 'add' }">add a wallet</router-link>
    <balance-list></balance-list>
  </div>
</template>

<script>
  import BalanceList from './balance-list.vue'

  export default {
    name: 'app-home',
    components: {
      BalanceList
    },
    computed: {
      wallets () {
        return this.$store.state.configuration.profiles[0].wallets
      }
    },
    methods: {
      refreshBalances () {
        this.wallets.forEach((wallet, walletId) => { // Todo: replace wallet Id with conf value
          this.$serviceWorker.controller.postMessage({ // Todo: move this in store and add loading wallets in vuex state
            action: 'balance-refresh',
            walletId: walletId,
            currencies: []
          })
        })
      }
    }
  }
</script>
