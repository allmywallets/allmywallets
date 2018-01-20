<template>
  <div class="holdings-value">
    <span class="holdings-amount">{{ currentHoldings|currency(currencies.primary) }}</span><br />
    <span class="holdings-secondary-amount">
      <span :class="{ 'movement': true, 'decrease': lastMovement < 0 }">{{ lastMovement|toFixed(2) }}%</span> &middot;
      {{ 0|currency(currencies.secondary) }}
    </span>
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
        'holdingsHistory',
        'currencies'
      ]),
      lastMovement () {
        const holdingsSum = sumHoldingsHistories(this.holdingsHistory)

        if (holdingsSum.length === 0) {
          return 0
        }

        return holdingsSum[holdingsSum.length - 1] / holdingsSum[holdingsSum.length - 3] * 100 - 100
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
    position: relative;
    z-index: 1;
    pointer-events: none;

    .holdings-amount {
      font-size: 5rem;
    }

    .holdings-secondary-amount {
      font-size: 1.2rem;
      font-family: $font-default;

      .movement {
        color: $color-success;

        &:before {
          content: '▲';
        }

        &.decrease {
          color: $color-danger;

          &:before {
            content: '▼';
          }
        }
      }
    }
  }
</style>
