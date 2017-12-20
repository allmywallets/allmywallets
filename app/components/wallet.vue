<template>
  <div>
    <div class="wallet">
      <div v-if="!loading">
        <a href="#" @click.prevent="refresh">refresh</a><br />
        <template v-if="!status.success">
          <strong>Last wallet update failed: {{ status.message }}</strong><br />
        </template>
        <template v-if="wallet !== null">
          {{ name }} ({{ network }} network) <br />
          last update {{ wallet.lastUpdate }} <br />
          <template v-if="wallet.balances.length > 0">
            <div v-for="balance in wallet.balances">
              {{ balance.amount }} {{ balance.unit }}
              <br /><br /> Transactions:
              <div v-for="transaction, key in balance.transactions" :key="key">
                type: {{ transaction.type }}<br />
                from: {{ transaction.from }}<br />
                to: {{ transaction.to }}<br />
                amount: {{ transaction.amount }} {{ wallet.unit }}
              </div>
            </div>
          </template>
          <template v-else>
            No balance
          </template>
        </template>
      </div>
      <div v-else-if="loading">
        <span v-if="loading">refreshing data</span>
      </div>
    </div>
  </div>
</template>

<script>
  import database from '../database'

  export default {
    name: 'wallet',
    props: {
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      network: {
        type: String,
        required: true
      },
      provider: {
        type: String,
        required: true
      },
      parameters: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        wallet: null,
        loading: false,
        status: { success: true, message: '' }
      }
    },
    methods: {
      async load (message) {
        if (message.data.action !== 'sync' || message.data.id !== this.id) {
          return
        }

        this.status = message.data.status

        if (!this.status.success) {
          return
        }

        this.updateWallet()
      },
      async refresh () {
        this.loading = true

        return this.$serviceWorker.controller.postMessage({
          action: 'sync',
          id: this.id
        })
      },
      async updateWallet () {
        this.loading = true

        try {
          this.wallet = await database.getWallet(this.id)
        } catch (e) {
          this.status = { success: false, message: e.message }
        }

        this.loading = false
      }
    },
    async mounted () {
      this.$serviceWorker.addEventListener('message', this.load)

      this.updateWallet()
    }
  }
</script>

<style scoped lang="scss">
  .wallet {
    height: 300px;
    overflow-y: scroll;
    border: 1px solid black;
  }
</style>
