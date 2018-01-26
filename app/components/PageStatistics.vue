<template>
  <div>
    <h2 v-translate>Statistics</h2>
    <p v-translate>
      You can use this page to get some statistics about your current holdings.
    </p>
    <div class="stats-card">
      <h3 v-translate>Holdings distribution</h3>
      <p v-translate="{ currency: currencies.primary }">
        These are your current holdings, based on their current values in %{currency}.
      </p>
      <pie-chart :options="holdingsPieOptions" :chart-data="holdingsPieData" />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PieChart from './PieChart.vue'
  import { computeAllHoldingsHistories } from '../manager/holdings-manager'
  import { formatCurrency } from '../manager/holdings-manager'

  export default {
    name: 'page-statistics',
    computed: {
      ...mapGetters([
        'balances',
        'pricesHistories',
        'currencies'
      ]),
      holdingsPieData () {
        const holdingsHistories = computeAllHoldingsHistories(this.pricesHistories, this.balances)
        const holdingsKeys = Object.keys(holdingsHistories).sort((key1, key2) => {
          const key1Value = holdingsHistories[key1].primary[holdingsHistories[key1].primary.length - 1]
          const key2Value = holdingsHistories[key2].primary[holdingsHistories[key2].primary.length - 1]

          return key1Value < key2Value
        })

        return {
          labels: holdingsKeys,
          datasets: [{
            data: holdingsKeys.map(key => holdingsHistories[key].primary[holdingsHistories[key].primary.length - 1]),
            backgroundColor: [
              "#1f77b4",
              "#ff7f0e",
              "#2ca02c",
              "#d62728",
              "#9467bd",
              "#8c564b",
              "#e377c2",
              "#7f7f7f",
              "#bcbd22",
              "#17becf"
            ]
          }]
        }
      },
      holdingsPieOptions () {
        return {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                return ` ${data['labels'][tooltipItem['index']]}: ${formatCurrency(
                  data['datasets'][0]['data'][tooltipItem['index']], this.currencies.primary
                )}`
              }
            }
          }
        }
      }
    },
    components: {
      PieChart
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .stats-card {
    @include card();
    padding: 10px 20px;
    max-width: 400px;
  }
</style>
