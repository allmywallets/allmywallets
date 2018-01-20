<template>
  <div class="actions">
    <div class="actions-left">
      <a href="#" @click.prevent="refreshBalances" title="Refresh all balances" v-tippy>
        <fa-icon icon="sync-alt" :spin="loading" />
      </a><!--
      --><a href="#" @click.prevent="toggleCharts" title="Toggle balances charts" v-tippy>
        <fa-icon icon="chart-area" />
      </a><!--
      --><a href="#" @click.prevent="collapseBalances" title="Toggle balances collapsing" v-tippy>
        <fa-icon :icon="display.balances.collapsed ? 'th' : 'th-large'" />
      </a>
    </div>
    <div class="actions-right">
      <router-link :to="{ name: 'home-add-wallet' }" title="Add a wallet" v-tippy>
        <fa-icon icon="plus" />
      </router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'balance-list-action',
    computed: {
      ...mapGetters([
        'wallets',
        'display'
      ]),
      loading () {
        return this.$store.state.balances.loading.balances
      }
    },
    methods: {
      async refreshBalances () {
        return this.$store.dispatch('refreshBalances', { wallets: this.wallets, serviceWorker: this.$serviceWorker })
      },
      toggleCharts () {
        const display = this.display
        display.balances.charts = !display.balances.charts

        return this.$store.dispatch('updateDisplay', { display })
      },
      collapseBalances () {
        const display = this.display
        display.balances.collapsed = !display.balances.collapsed

        return this.$store.dispatch('updateDisplay', { display })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .actions {
    margin-bottom: 10px;

    &::after {
      content: ' ';
      display: table;
      clear: both;
    }

    a {
      background: $color-section-notifications;
      padding: 6px 8px 4px;

      &:first-child {
        padding-left: 12px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
      }

      &:last-child {
        padding-right: 12px;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
      }

      &:not(:last-child) {
        margin-right: 1px;
      }
    }

    .actions-left {
      float: left;
    }

    .actions-right {
      float: right;
    }
  }
</style>
