<template>
  <div>
    <div v-if="wallet" class="wallet">
      {{ wallet.name }} ({{ wallet.currency }}) <br />
      {{ wallet.amount }} {{ wallet.unit }}
      <br /><br /> Transactions:
      <div v-for="transaction, key in wallet.transactions" :key="key">
        type: {{ transaction.type }}<br />
        from: {{ transaction.from }}<br />
        to: {{ transaction.to }}<br />
        amount: {{ transaction.amount }} {{ wallet.unit }}
      </div>
    </div>
    <div v-else-if="wallet === null">
      loading
    </div>
    <div v-else>
      error
    </div>
  </div>
</template>

<script>
  import Proxy from '../providers'

  export default {
    name: 'wallet',
    props: ['currency', 'provider', 'parameters'],
    data () {
      return {
        wallet: null
      }
    },
    mounted () {
      new Proxy(this.currency, this.provider, this.parameters)
          .getWalletData()
          .then((wallet) => { this.wallet = wallet })
          .catch(() => { this.wallet = false })
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
