<template>
  <div class="balance-tools">
    <a href="#" title="Click to copy your public key" v-tippy><icon icon="copy"></icon></a>
    <a href="#" title="View wallet transactions" v-tippy><icon icon="list"></icon></a>
    <a href="#" @click.prevent="refresh" :title="`Updated ${lastUpdate}`" v-tippy>
      <icon icon="sync-alt" :spin="loading"></icon>
    </a>
    <a href="#" v-if="status" :title="`Wallet update failed: ${status.title}`" class="text-warning" v-tippy>
      <icon icon="exclamation-triangle"></icon>
    </a>
  </div>
</template>

<script>
  import moment from 'moment'
  import Balance from '../model/Balance'

  export default {
    name: 'balance-tools',
    props: {
      balance: {
        type: Balance,
        required: true
      }
    },
    data () {
      return {
        loading: false
      }
    },
    computed: {
      status () {
        this.loading = false

        return this.$store.state.notifications.find(notification => {
          return notification.level === 'ERROR' && notification.walletId === this.balance.walletId
        })
      },
      lastUpdate () {
        this.loading = false

        return moment(this.balance.lastUpdate).fromNow()
      }
    },
    methods: {
      async refresh () {
        this.loading = true

        return this.$serviceWorker.controller.postMessage({
          action: 'balance-refresh',
          walletId: this.balance.walletId,
          currencies: [this.balance.ticker]
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .balance-tools {
    text-align: right;
    margin-right: 5px;
    letter-spacing: 0.3rem;
  }
</style>
