<template>
  <div class="holdings-value">
    <span class="holdings-amount">{{ currentHoldings.primary|currency(currencies.primary) }}</span><br />
    <span :class="{ 'evolution': true, 'decrease': lastMovement < 0 }">{{ lastChange|abs|currency(currencies.primary) }}
      ({{ lastMovement|toFixed(2) }}%)
    </span>
    <span class="holdings-secondary-amount">
      │ {{ currentHoldings.secondary|currency(currencies.secondary) }}
    </span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'holdings-value',
    computed: {
      ...mapGetters([
        'globalHoldingsHistory',
        'holdingsHistory',
        'currencies'
      ]),
      currentHoldings () {
        const {primary, secondary} = this.globalHoldingsHistory

        if (primary.length === 0) {
          return {
            primary: 0,
            secondary: 0
          }
        }

        return {
          primary: primary[primary.length - 1],
          secondary: secondary[secondary.length - 1]
        }
      },
      lastMovement () {
        const holdingsSum = this.globalHoldingsHistory.primary

        if (holdingsSum.length === 0) {
          return 0
        }

        return holdingsSum[holdingsSum.length - 1] / holdingsSum[holdingsSum.length - 3] * 100 - 100
      },
      lastChange () {
        const holdingsSum = this.globalHoldingsHistory.primary

        if (holdingsSum.length === 0) {
          return 0
        }
        return holdingsSum[holdingsSum.length - 1] - holdingsSum[holdingsSum.length - 3]
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/scss/vars';

  .holdings-value {
    font-family: $font-title;
    text-align: center;
    padding-top: 75px;
    color: $color-primary;
    line-height: 1.5rem;
    position: relative;
    z-index: 1;
    pointer-events: none;

    @media screen and (min-width: $breakpoint-medium) {
      padding-top: 100px;
    }

    .holdings-amount {
      font-size: 3rem;

      @media screen and (min-width: $breakpoint-medium) {
        font-size: 5rem;
      }
    }

    .holdings-secondary-amount, .evolution {
      font-family: $font-default;
    }

    .evolution {
      color: $color-success;

      &:before {
        content: '▲ +';
      }

      &.decrease {
        color: $color-danger;

        &:before {
          content: '▼ -';
        }
      }
    }
  }
</style>
