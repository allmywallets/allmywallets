<template>
  <div class="holdings">
    <holdings-value />
    <holdings-chart />
  </div>
</template>

<script>
  import HoldingsValue from './HoldingsValue.vue'
  import HoldingsChart from './HoldingsChart.vue'

  export default {
    components: {
      HoldingsValue,
      HoldingsChart
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
