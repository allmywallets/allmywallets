<template>
  <div class="actions">
    <div class="actions-left">
      <a href="#" title="Collapse balances" v-tippy>
        <fa-icon icon="compress" />
      </a><!--
      --><a href="#" @click.prevent="refreshBalances" title="Refresh all balances" v-tippy>
        <fa-icon icon="sync-alt" :spin="loading" />
      </a>
    </div>
    <div class="actions-right">
      <router-link :to="{ name: 'add' }" title="Add a wallet" v-tippy>
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
        'wallets'
      ]),
      loading () {
        return this.$store.state.balances.loading.balances
      }
    },
    methods: {
      async refreshBalances () {
        return this.$store.dispatch('refreshBalances', { wallets: this.wallets, serviceWorker: this.$serviceWorker })
      }
    }
  }
</script>

<style lang="scss">
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
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
      }

      &:last-child {
        padding-right: 12px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }

      &:not(:last-child) {
        margin-right: 2px;
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
