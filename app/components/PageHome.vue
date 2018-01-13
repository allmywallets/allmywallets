<template>
  <div>
    <holdings-summary />
    <balance-list-actions />
    <article class="balance-list">
      <balance-item v-for="balance, key in balances" :key="key" :id="balance.id" />
    </article>
    <modal-upgrade v-if="$route.name === 'home-upgraded'" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
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
      ModalUpgrade
    },
    computed: {
      ...mapGetters([
        'balances'
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
