<template>
  <div v-if="wallet && balance" class="balance">
    <header class="balance-header">
      <span class="balance-logo">
        <i :class="`cf cf-${balance.ticker.toLowerCase()}`"></i>
      </span>
      <h3 class="balance-name">
        {{ wallet.name }}<br />
        <small class="balance-network">{{ wallet.network|camelcase }}</small>
      </h3>
    </header>
    <div class="balance-amount">
      <i :class="`cf cf-${balance.ticker.toLowerCase()}`"></i><span class="balance-amount-value" :title="balance.amount" v-tippy>{{ balance.amount|toPrecision(4) }}</span><br />
      <span class="balance-btc">
        <i class="cf cf-btc"></i>? ($?)
      </span>
    </div>
    <footer class="balance-footer">
      <div class="balance-provider">
        Data from {{ wallet.provider|camelcase }}
      </div>
      <div class="balance-tools">
        <a href="#" title="Click to copy your public key" v-tippy><icon icon="copy"></icon></a>
        <a href="#" title="View wallet transactions" v-tippy><icon icon="list"></icon></a>
        <a href="#" @click.prevent="refresh" :title="`Last update: ${balance.lastUpdate.getMonth() + 1}/${balance.lastUpdate.getDate()}/${balance.lastUpdate.getFullYear()} at ${balance.lastUpdate.getHours()}:${balance.lastUpdate.getMinutes()}`" v-tippy>
          <icon icon="sync-alt" :spin="loading"></icon>
        </a>
        <a href="#" :title="`Last update failed: ${status.message}`" v-if="!status.success" class="text-warning">
          <icon icon="exclamation-triangle"></icon>
        </a>
      </div>
    </footer>
  </div>
  <div v-else>
    No data
  </div>
</template>

<script>
  import database from '../database'
  import Configurator from '../configurator'

  export default {
    name: 'balance',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        wallet: null,
        balance: null,
        status: { success: true, message: '' },
        loading: false
      }
    },
    methods: {
      async load (message) {
        if (message.data.action !== 'sync' || message.data.id !== parseInt(this.id.split('.')[0])) {
          return
        }

        this.status = message.data.status

        if (!this.status.success) {
          return
        }

        this.updateBalance()
      },
      async refresh () {
        this.loading = true

        return this.$serviceWorker.controller.postMessage({
          action: 'sync',
          id: parseInt(this.id.split('.')[0])
        })
      },
      async updateBalance () {
        this.loading = true

        try {
          this.balance = await database.getBalance(this.id)
        } catch (e) {
          this.status = { success: false, message: e.message }
        }

        this.loading = false
      }
    },
    async mounted () {
      this.$serviceWorker.addEventListener('message', this.load)

      this.wallet = await Configurator.getWallet(this.id.split('.')[0])

      this.updateBalance()
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .balance {
    width: 100%;
    margin: 0 10px 20px;
    background: #fafafa;
    border-radius: 3px;
    padding: 3px 15px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 1fr 25px;
    flex-grow: 1;
    flex-basis: 0;
    cursor: default;

    @media screen and (min-width: $breakpoint-medium) {
      width: auto;
    }

    .balance-header {
      grid-row: 1;
      grid-column: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .balance-logo {
        font-size: 2rem;
        display: inline-block;
        margin: 0 5px;
      }

      .balance-name {
        line-height: 0.9rem;
        display: inline-block;
        margin-top: 13px;

        .balance-network {
          font-style: italic;
          font-size: 0.9rem;
        }
      }
    }

    .balance-amount {
      grid-row: 2;
      font-size: 2rem;
      text-align: center;
      padding: 20px 10px 25px;
      line-height: 1.4rem;

      .cf, .balance-amount-value {
        display: inline-block;
        vertical-align: middle;
      }

      .cf {
        font-size: 0.6em;
      }

      .balance-btc {
        display: inline-block;
        font-size: 0.8rem;
        vertical-align: middle;

        .cf {
          font-size: 0.8em;
        }
      }
    }

    .balance-footer {
      grid-row: 3;
      position: relative;
      font-size: 0.8rem;
      display: flex;
      justify-content: space-between;
      white-space: nowrap;

      .balance-tools {
        text-align: right;
        margin-right: 5px;
      }
    }
  }
</style>
