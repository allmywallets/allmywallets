<template>
  <div class="balance-tools">
    <a
      href="#"
      class="address"
      title="Public key copied!"
      :data-clipboard-text="balance.address"
      v-if="balance.address !== ''"
      v-tippy="{ trigger: 'click' }"
    >
      <fa-icon icon="copy" />
    </a>
    <a href="#" v-if="!display.balances.collapsed" @click.prevent="refresh" :title="`Updated ${lastUpdate}`" v-tippy>
      <fa-icon icon="sync-alt" :spin="loading" />
    </a>
    <a href="#" v-if="status" :title="`Wallet update failed: ${status.title}`" class="text-warning" v-tippy>
      <fa-icon icon="exclamation-triangle" />
    </a>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Clipboard from 'clipboard'
  import moment from 'moment'
  import Balance from '../model/Balance'

  export default {
    name: 'balance-item-tools',
    props: {
      balance: {
        type: Balance,
        required: true
      }
    },
    data () {
      return {
        now: new Date(),
        interval: null,
        loading: false
      }
    },
    computed: {
      ...mapGetters([
        'notifications',
        'display'
      ]),
      status () {
        return this.notifications.find(notification => {
          return notification.level === 'ERROR' && notification.walletId === this.balance.wallet.id
        })
      },
      lastUpdate () {
        return moment(this.balance.lastUpdate).from(this.now)
      }
    },
    watch: {
      balance (oldBalance, newBalance) {
        if (newBalance.lastUpdate === oldBalance.lastUpdate) {
          return
        }

        this.loading = false
      }
    },
    mounted () {
      new Clipboard('.address')
      this.refreshDateEverySecond()
    },
    destroyed () {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    methods: {
      async refresh () {
        this.loading = true

        return this.$serviceWorker.controller.postMessage({
          action: 'balance-refresh',
          walletId: this.balance.wallet.id,
          currencies: [this.balance.ticker]
        })
      },
      refreshDateEverySecond () {
        this.interval = setInterval(() => { this.now = new Date() }, 60 * 1000)
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

  input {
    display: none;
  }
</style>
