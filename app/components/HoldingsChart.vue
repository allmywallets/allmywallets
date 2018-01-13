<template>
  <div class="holdings-chart">
    <canvas ref="plot"></canvas>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Chart from 'chart.js'
  import { sumHoldingsHistories } from '../manager/holdings-manager'

  export default {
    name: 'holdings-chart',
    computed: {
      ...mapGetters([
        'totalHoldings'
      ])
    },
    async mounted () {
      this.$store.watch( // Todo: rewrite this properly
        state => {
          const histories = sumHoldingsHistories(state.balances.holdings)

          if (histories.length === 0) {
            return
          }

          new Chart(this.$refs.plot.getContext('2d'), {
            type: 'line',
            data: {
              labels: [...Array(histories.length).keys()],
              datasets: [{
                data: histories,
                backgroundColor: '#dee2ed',
                borderColor: '#dee2ed'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false
              },
              scales: {
                yAxes: [{
                  display: false,
                  padding: 0
                }],
                xAxes: [{
                  display: false,
                  padding: 0
                }]
              },
              elements: {
                point: { radius: 0 },
                line: { tension: 0 }
              }
            }
          })
        }
      )
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  canvas {
    height: 300px;
  }

  .holdings-chart {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
  }
</style>
