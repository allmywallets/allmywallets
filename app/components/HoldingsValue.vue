<template>
  <div class="holdings-value">
    <span class="holdings-amount">${{ currentHoldings|toFixed(2) }}</span>
    <span class="holdings-secondary-amount"><span class="ticker">BTC</span>0</span><br />
    <span :class="{ 'movement': true, 'decrease': lastMovement < 0 }">{{ lastMovement|toFixed(1) }}%</span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { sumHoldingsHistories } from '../manager/holdings-manager'

  export default {
    name: 'holdings-value',
    computed: {
      ...mapGetters([
        'currentHoldings',
        'holdingsHistory'
      ]),
      lastMovement () {
        const holdingsSum = sumHoldingsHistories(this.holdingsHistory)

        return holdingsSum[holdingsSum.length - 1] / holdingsSum[holdingsSum.length - 2] * 100 - 100
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
    line-height: 1rem;
    position: relative;
    z-index: 1;
    pointer-events: none;

    .holdings-amount {
      font-size: 5rem;
    }

    .movement {
      font-size: 1.2rem;
      color: $color-success;
      font-family: $font-default;

      &:before {
        content: '▲';
        vertical-align: 1px;
      }

      &.decrease {
        color: $color-danger;

        &:before {
          content: '▼';
        }
      }
    }

    .holdings-secondary-amount {
      font-size: 2rem;
      line-height: 2.4rem;

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
