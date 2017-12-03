<template>
  <div>
    <div class="wallet">
      <div v-if="wallet && !loading">
        <a href="#" @click.prevent="refresh">refresh</a>
        {{ wallet.name }} ({{ wallet.currency }}) <br />
        last update {{ wallet.lastUpdate }} <br />
        {{ wallet.amount }} {{ wallet.unit }}
        <br /><br /> Transactions:
        <div v-for="transaction, key in wallet.transactions" :key="key">
          type: {{ transaction.type }}<br />
          from: {{ transaction.from }}<br />
          to: {{ transaction.to }}<br />
          amount: {{ transaction.amount }} {{ wallet.unit }}
        </div>
      </div>
      <div v-else-if="loading">
        <span v-if="loading">refreshing data</span>
      </div>
      <div v-else>
        error
      </div>
    </div>
  </div>
</template>

<script>
  import Synchronizer from '../synchronizer'

  export default {
    name: 'wallet',
    props: {
      id: {
        type: Number,
        required: true
      },
      currency: {
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
        loading: true
      }
    },
    methods: {
      async load (message) {
        if (message.data.action !== 'sync' || message.data.id !== this.id) {
          return
        }

        if (!message.data.success) {
          console.error('Failed loading wallet data')
        }

        this.wallet = await Synchronizer.load(message.data.id)
        this.loading = false
      },
      async refresh () {
        this.loading = true

        navigator.serviceWorker.addEventListener('message', this.load)

        return navigator.serviceWorker.controller.postMessage({
          action: 'sync',
          id: this.id
        })
      }
    },
    async mounted () {
      this.wallet = await Synchronizer.load(this.id)
      this.loading = false
    }
  }
</script>

<style scoped lang="scss">
  .wallet {
    max-height: 200px;
    overflow-y: scroll;
    max-width: 500px;
    float: left;
    border: 1px solid black;
    margin-right: 10px;
  }
</style>
