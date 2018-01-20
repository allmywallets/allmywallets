<template>
  <div class="balance-tools">
    <a href="#"
       class="address"
       title="Public key copied!"
       :data-clipboard-text="balance.address"
       v-if="balance.address !== ''"
       v-tippy="{ trigger: 'click' }">
      <fa-icon icon="copy" />
    </a>
    <a href="#" @click.prevent="refresh" :title="`Updated ${lastUpdate}`" v-tippy>
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
        loading: false
      }
    },
    computed: {
      ...mapGetters([
        'notifications'
      ]),
      status () {
        this.loading = false

        return this.notifications.find(notification => {
          return notification.level === 'ERROR' && notification.walletId === this.balance.wallet.id
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
          walletId: this.balance.wallet.id,
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
