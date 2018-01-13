<template>
  <div>
    <canvas ref="plot"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'balance-item-chart',
    props: {
      ticker: { // Todo: retrieve price history for ticker
        type: String,
        required: true
      }
    }
  }
</script>
