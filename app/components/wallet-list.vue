<template>
  <section>
    Last update: {{ lastUpdate }} (auto every 15 minutes) <a href="#" @click.prevent="refresh()">update manually</a> <span v-if="loading">loading</span><br />
    <wallet
            v-for="wallet, key in wallets"
            :key="key"
            :wallet="wallet"
    ></wallet>
  </section>
</template>

<script>
  import Synchronizer from '../synchronizer'
  import Wallet from './wallet.vue'

  export default {
    name: 'wallet-list',
    data () {
      return {
        wallets: [],
        lastUpdate: null,
        loading: false
      }
    },
    components: {
      Wallet
    },
    methods: {
      async load () {
        this.wallets = await Synchronizer.load()
        this.lastUpdate = await Synchronizer.lastUpdate()
      },
      async refresh () {
        this.loading = true
        await navigator.serviceWorker.ready.then((registration) => registration.sync.register('wallets-sync'))
        await this.load()
        this.loading = false
      }
    },
    async mounted () {
      await this.load()
      setInterval(this.refresh, 900000)
    }
  }
</script>
