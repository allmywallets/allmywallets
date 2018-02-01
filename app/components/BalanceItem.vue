<template>
  <div :class="{ 'balance': true, 'balance-highlighted': highlighted }">
    <holdings-chart :class="{ 'balance-background': true, 'showed': showCharts }" :options="chartOptions" :chart-data="chartData" />
    <div class="balance-content">
      <header class="balance-header">
        <span class="balance-logo" v-if="logo">
          <img height="40" :src="`/static/icons/${logo}%402x.png`" @error="removeLogo" :alt="balance.ticker" />
        </span>
        <h4 class="balance-name">
          {{ balance.wallet.name }}<br />
          <small class="balance-currency">{{ balance.currency }}</small>
        </h4>
      </header>
      <div class="balance-amount">
        <small>{{ balance.ticker }}</small><span :title="balance.amount" v-tippy>{{ balance.amount|toPrecision(4) }}</span><br />
        <balance-item-prices :ticker="balance.ticker" :amount="balance.amount" />
      </div>
      <footer class="balance-footer">
        <div class="balance-provider">
          <span class="badge badge-light">{{ provider }}</span>
        </div>
        <balance-item-tools :balance="balance" />
      </footer>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import icons from 'cryptocurrency-icons/manifest.json'
  import HoldingsChart from './HoldingsChart.vue'
  import BalanceItemPrices from './BalanceItemPrices.vue'
  import BalanceItemTools from './BalanceItemTools.vue'
  import Proxy from '../providers'

  export default {
    name: 'balance-item',
    components: {
      HoldingsChart,
      BalanceItemPrices,
      BalanceItemTools
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        highlighted: false,
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
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'balances',
        'pricesHistories',
        'display'
      ]),
      balance () {
        const balance = this.balances.find(balance => balance.id === this.id)

        if (balance === null) {
          throw new Error(`Cannot find balance with id ${this.id}`)
        }

        return balance
      },
      logo () {
        const ticker = this.balance.ticker.toLowerCase()

        if (Object.keys(icons.icons).includes(ticker)) {
          return icons.icons[ticker]
        }

        return false
      },
      provider () {
        return Proxy.getProvidersList().find(provider => provider.provider === this.balance.wallet.provider).name
      },
      showCharts () {
        return this.display.balances.charts
      },
      chartData () {
        const history = this.pricesHistories.find(history => history.ticker === this.balance.ticker)

        let prices = []
        if (history) {
          prices = history.getPrices('primary')
        }

        return {
          labels: prices,
          datasets: [{
            data: prices,
            backgroundColor: '#dee2ed',
            borderColor: '#dee2ed'
          }]
        }
      }
    },
    watch: {
      balance (newBalance, oldBalance) {
        if (newBalance.lastUpdate === oldBalance.lastUpdate) {
          return
        }

        this.highlighted = true

        setTimeout(() => {
          this.highlighted = false
        }, 200)
      }
    },
    async mounted () {
      this.$serviceWorker.addEventListener('message', this.load)
    },
    methods: {
      removeLogo (event) {
        event.target.remove()
      }
    }
  }
</script>

<style lang="scss">
  @import '../scss/vars';

  .balance {
    margin: 0 10px 20px;
    cursor: default;
    position: relative;
    width: 100%;
    @include card();
    transition: transform .2s;

    &.balance-highlighted {
      transform: scale3d(1.1, 1.1, 1.1);
    }

    h4 {
      color: $color-text;
    }

    @media screen and (min-width: $breakpoint-medium) {
      width: calc(50% - 20px);
    }

    @media screen and (min-width: $breakpoint-large) {
      width: calc(33.33% - 20px);
    }

    @media screen and (min-width: $breakpoint-larger) {
      width: calc(25% - 20px);
    }

    .balance-background {
      position: absolute;
      left: 0;
      right: 0;
      top: 50px;
      bottom: 0;
      overflow: hidden;
      opacity: 0;
      transition: opacity .3s;

      &.showed {
        opacity: 1;
      }

      canvas {
        height: 120px;
      }
    }

    .balance-content {
      position: relative;
      z-index: 100;
      padding: 3px 10px;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 50px 1fr 25px;
    }

    .balance-header {
      grid-row: 1;
      grid-column: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .balance-logo {
        font-size: 2rem;
        display: inline-block;
        margin: 0 5px;
      }

      .balance-name {
        line-height: 0.9rem;
        display: inline-block;
        margin-top: 13px;
        white-space: nowrap;

        .balance-currency {
          font-style: italic;
          font-size: 0.9rem;
        }
      }
    }

    .balance-amount {
      grid-row: 2;
      font-size: 2rem;
      text-align: center;
      padding: 35px 10px 40px;
      line-height: 1rem;

      small {
        font-size: 0.4em;
        margin-right: 2px;
      }
    }

    .balance-footer {
      grid-row: 3;
      position: relative;
      font-size: 0.8rem;
      display: flex;
      justify-content: space-between;
      white-space: nowrap;
    }
  }
</style>
