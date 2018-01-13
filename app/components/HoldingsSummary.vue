<template>
  <div class="holdings">
    <holdings-value :total-holdings="currentHoldings" />
    <holdings-chart />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import HoldingsValue from './HoldingsValue.vue'
  import HoldingsChart from './HoldingsChart.vue'

  export default {
    components: {
      HoldingsValue,
      HoldingsChart
    },
    computed: {
      ...mapGetters([
        'totalHoldings'
      ]),
      currentHoldings () {
        return this.totalHoldings[this.totalHoldings.length - 1]
      }
    }
  }
</script>

<style lang="scss">
  @import '../scss/vars';

  .holdings {
    margin-bottom: 12px;
    position: relative;
    height: 300px;
    border-radius: 0 0 15px 15px;
    overflow: hidden;
  }
</style>
