<template>
  <div class="holdings">
    <holdings-chart :options="chartOptions" :chartData="chartData" class="holdings-chart" />
    <holdings-value />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { sumHoldingsHistories } from '../manager/holdings-manager'
  import HoldingsValue from './HoldingsValue.vue'
  import HoldingsChart from './HoldingsChart.vue'

  export default {
    components: {
      HoldingsValue,
      HoldingsChart
    },
    data () {
      return {
        chartOptions: {
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
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            yAlign: 'top',
            callbacks: {
              title: () => {
                return ''
              },
              label: (tooltipItem, data) => {
                return '$' + data['datasets'][0]['data'][tooltipItem['index']].toFixed(2)
              }
            },
            displayColors: false
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'globalHoldingsHistory'
      ]),
      chartData () {
        const holdingsHistory = this.globalHoldingsHistory.primary

        return {
          labels: [...Array(holdingsHistory.length).keys()],
          datasets: [{
            data: holdingsHistory,
            backgroundColor: '#dee2ed',
            borderColor: '#dee2ed'
          }]
        }
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

    .holdings-chart {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      overflow: hidden;

      canvas {
        height: 300px;
      }
    }
  }
</style>
