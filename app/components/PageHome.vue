<template>
  <div>
    <template v-if="wallets.length > 0">
      <holdings-summary />
      <balance-list-actions />
      <article class="balance-list" v-if="balances.length > 0">
        <balance-item v-for="balance, key in balances" :key="key" :id="balance.id" />
      </article>
      <article v-else>
        <p v-translate>No balance has been loaded yet. Click on the button below to refresh your wallets.</p>
        <p><a href="#" @click.prevent="refreshBalances" class="button" v-translate>Refresh wallets balances</a></p>
      </article>
    </template>
    <first-launch v-else-if="!$store.state.balances.loading.balances" />
    <modal-upgrade v-if="$route.name === 'home-upgraded'" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import FirstLaunch from './FirstLaunch.vue'
  import BalanceItem from './BalanceItem.vue'
  import HoldingsSummary from './HoldingsSummary.vue'
  import BalanceListActions from './BalanceListActions.vue'
  import ModalUpgrade from './ModalUpgrade.vue'

  export default {
    name: 'page-home',
    components: {
      HoldingsSummary,
      BalanceListActions,
      BalanceItem,
      FirstLaunch,
      ModalUpgrade
    },
    methods: {
      async refreshBalances () {
        return this.$store.dispatch('refreshBalances', { wallets: this.wallets, serviceWorker: this.$serviceWorker })
      }
    },
    computed: {
      ...mapGetters([
        'balances',
        'wallets'
      ])
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .balance-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
  }
</style>
