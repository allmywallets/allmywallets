<template>
  <div class="holdings-value">
    <span class="holdings-amount">
      <template v-if="!loading">${{ totalHoldings|toPrecision(6) }}</template>
      <template v-else>Retrieving your holdings</template>
    </span><br />
    <span class="holdings-secondary-amount">
      <template v-if="!loading"><span class="ticker">BTC</span>0</template>
      <template v-else>Please wait <fa-icon icon="sync-alt" spin /></template>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'holdings-value',
    props: {
      totalHoldings: {
        required: true
      }
    },
    computed: {
      loading () {
        return this.$store.state.balances.loading.holdings
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
