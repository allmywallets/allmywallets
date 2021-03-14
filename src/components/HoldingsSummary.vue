<template>
  <div class="holdings">
    <holdings-chart :options="chartOptions" :chart-data="chartData" class="holdings-chart" />
    <holdings-value />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import HoldingsValue from './HoldingsValue.vue'
  import HoldingsChart from './HoldingsChart.vue'
  import { formatCurrency } from '../manager/holdings-manager'

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
                return formatCurrency(data['datasets'][0]['data'][tooltipItem['index']], this.currencies.primary)
              }
            },
            displayColors: false
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'globalHoldingsHistory',
        'currencies'
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
  @import '../assets/scss/vars';

  .holdings {
    margin-bottom: 12px;
    position: relative;
    height: 200px;
    border-radius: 0 0 $radius-default $radius-default;
    overflow: hidden;

    @media screen and (min-width: $breakpoint-medium) {
      height: 300px;
    }

    .holdings-chart {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
      overflow: hidden;

      canvas {
        height: 300px;
      }
    }
  }
</style>
