<template>
  <div>
    <h2>AllMyWallets</h2>
    <a href="#" @click.prevent="refreshBalances">refresh all</a> &bull;
    <router-link :to="{ name: 'add' }">add a wallet</router-link>
    <article class="balance-list">
      <balance-item v-for="balance, key in balances" :key="key" :id="balance.id"></balance-item>
    </article>
  </div>
</template>

<script>
  import BalanceItem from './BalanceItem.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'page-home',
    components: {
      BalanceItem
    },
    computed: {
      ...mapGetters([
        'wallets',
        'balances'
      ])
    },
    methods: {
      refreshBalances () {
        this.wallets.forEach(wallet => {
          this.$serviceWorker.controller.postMessage({ // Todo: move this in store and add loading wallets in vuex state
            action: 'balance-refresh',
            walletId: wallet.id,
            currencies: []
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .balance-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 -10px;
  }
</style>
