<template>
  <div class="holdings-value">
    <span class="holdings-amount">
      <template v-if="!loading.holdings">${{ totalHoldings.usd|toPrecision(6) }}</template>
      <template v-else>Retrieving your holdings</template>
    </span><br />
    <span class="holdings-secondary-amount">
      <template v-if="!loading.holdings"><span class="ticker">BTC</span>{{ totalHoldings.btc|toPrecision(3) }}</template>
      <template v-else>Please wait <fa-icon icon="sync-alt" spin /></template>
    </span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'holdings-value',
    computed: {
      ...mapGetters([
        'holdings',
        'loading'
      ]),
      totalHoldings () {
        return this.holdings.reduce((sum, holding) => {
          sum.usd += holding.usd // Todo: replace btc/usd with primary/secondary
          sum.btc += holding.btc

          return sum
        }, {
          usd: 0,
          btc: 0
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .holdings-value {
    font-family: $font-title;
    text-align: center;
    padding-top: 100px;
    color: $color-primary;
    line-height: 2rem;

    .holdings-amount {
      font-size: 5rem;
    }

    .holdings-secondary-amount {
      font-size: 2rem;

      svg {
        font-size: 1rem;
      }

      .ticker {
        font-size: 1rem;
        margin-right: 5px;
      }
    }
  }
</style>
