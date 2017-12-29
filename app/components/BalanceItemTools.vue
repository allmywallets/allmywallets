<template>
  <div class="balance-tools">
    <a href="#"
       class="address"
       title="Public key copied!"
       v-for="address in wallet.parameters.addresses"
       :data-clipboard-text="address"
       v-tippy="{ trigger: 'click' }">
      <icon icon="copy"></icon>
    </a>
    <a href="#" @click.prevent="refresh" :title="`Updated ${lastUpdate}`" v-tippy>
      <icon icon="sync-alt" :spin="loading"></icon>
    </a>
    <a href="#" v-if="status" :title="`Wallet update failed: ${status.title}`" class="text-warning" v-tippy>
      <icon icon="exclamation-triangle"></icon>
    </a>
  </div>
</template>

<script>
  import Clipboard from 'clipboard'
  import { mapGetters } from 'vuex'
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
        loading: false
      }
    },
    computed: {
      ...mapGetters([
        'wallets'
      ]),
      wallet () {
        return this.wallets[this.balance.walletId]
      },
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
    },
    mounted () {
      new Clipboard('.address')
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
