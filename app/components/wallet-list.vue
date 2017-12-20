<template>
  <section>
    <wallet
            v-for="wallet, key in wallets"
            :key="key"
            :id="key"
            :name="wallet.name"
            :network="wallet.network"
            :provider="wallet.provider"
            :parameters="wallet.parameters"
    ></wallet>
  </section>
</template>

<script>
  import Configurator from '../configurator'
  import Wallet from './wallet.vue'

  export default {
    name: 'wallet-list',
    data () {
      return {
        wallets: []
      }
    },
    components: {
      Wallet
    },
    async mounted () {
      const configuration = await Configurator.getConfiguration()
      const profile = configuration.profiles[0]

      if (!Object(profile).hasOwnProperty('wallets')) {
        return
      }

      this.wallets = profile.wallets
    }
  }
</script>
