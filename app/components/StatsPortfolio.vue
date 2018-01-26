<script>
import { mapGetters } from 'vuex'
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  mounted () {
    const balancesMap = {}
    this.balances.forEach(balance => {
      const value = balance._amount * this.getLastPrice(balance.ticker)
      balancesMap[balance.currency] = balancesMap[balance.currency] ? balancesMap[balance.currency] + value : value
    })

    const chartData = {
      labels: Object.keys(balancesMap),
      datasets: [{
          data: Object.values(balancesMap)
      }]
    }

    this.renderChart(chartData, {responsive: true, maintainAspectRatio: false})
  },
  methods: {
    getLastPrice(ticker) {
      let lastPrice = 0
      this.pricesHistories.forEach(history => {
        if(history.ticker === ticker) {
          lastPrice = history._prices.primary.slice(-1)
          return false
        }
      })
      return lastPrice[0]
    }
  },
  computed: {
    ...mapGetters([
      'balances',
      'pricesHistories'
    ])
  },
}
</script>
