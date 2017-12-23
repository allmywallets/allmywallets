<template>
  <section>
    <a href="#" @click.prevent="refreshAll">refresh all</a>
    <article>
      <balance v-for="balance in balances" :key="balance.key" :id="balance.key"></balance>
    </article>
  </section>
</template>

<script>
  import Configurator from '../configurator'
  import Balance from './balance.vue'

  export default {
    name: 'balance-list',
    components: {
      Balance
    },
    computed: {
      balances () {
        return this.$store.state.balances
      }
    },
    methods: {
      async refreshAll () {
        this.wallets.forEach((wallet, key) => {
          return this.$serviceWorker.controller.postMessage({
            action: 'sync',
            id: key
          })
        })
      }
    },
    async mounted () {
      this.wallets = await Configurator.getWallets()
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  article {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 -10px;
  }
</style>
