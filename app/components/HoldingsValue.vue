<template>
  <div class="holdings-value">
    <span class="holdings-amount">
      ${{ currentHoldings|toFixed(2) }}
    </span><br />
    <span class="holdings-secondary-amount">
      <span class="ticker">BTC</span>0
    </span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'holdings-value',
    computed: {
      ...mapGetters([
        'currentHoldings'
      ])
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
