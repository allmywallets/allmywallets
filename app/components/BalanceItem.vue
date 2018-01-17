<template>
  <div class="balance">
    <holdings-chart :class="{ 'balance-background': true, 'showed': showCharts }" :options="chartOptions" :chartData="chartData" />
    <div class="balance-content">
      <header class="balance-header">
      <span class="balance-logo">
        <img height="40" :src="`/static/icons/${balance.ticker.toLowerCase()}%402x.png`" @error="removeLogo" :alt="balance.ticker" />
      </span>
        <h4 class="balance-name">
          {{ balance.wallet.name }}<br />
          <small class="balance-currency">{{ balance.currency }}</small>
        </h4>
      </header>
      <div class="balance-amount">
        <small>{{ balance.ticker }}</small><span class="balance-amount-value" :title="balance.amount" v-tippy>{{ balance.amount|toPrecision(4) }}</span><br />
        <span class="balance-btc">
          <template v-if="price.usd !== 0">
            <span class="dollar">$</span>{{ currentPrice|toPrecision(4) }}
          </template>
          <template v-if="price.btc !== 0">
            (BTC {{ price.btc|toPrecision(4) }})
          </template>
        </span>
      </div>
      <footer class="balance-footer">
        <div class="balance-provider">
          Data from {{ balance.wallet.provider|camelcase }}
        </div>
        <balance-item-tools :balance="balance" />
      </footer>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import HoldingsChart from './HoldingsChart.vue'
  import BalanceItemTools from './BalanceItemTools.vue'

  export default {
    name: 'balance-item',
    components: {
      HoldingsChart,
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
        price: {
          btc: 0
        },
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
        'priceHistories',
        'display'
      ]),
      balance () {
        const balance = this.balances.find(balance => balance.id === this.id)

        if (balance === null) {
          throw new Error(`Cannot find balance with id ${this.id}`)
        }

        return balance
      },
      showCharts () {
        return this.display.balances.charts
      },
      currentPrice () {
        return this.priceHistory[this.priceHistory.length - 1] * this.balance.amount
      },
      priceHistory () {
        let priceHistory = this.priceHistories[this.balance.ticker]

        if (priceHistory === undefined) {
          priceHistory = []
        }

        return priceHistory
      },
      chartData () {
        return {
          labels: this.priceHistory,
          datasets: [{
            data: this.priceHistory,
            backgroundColor: '#dee2ed',
            borderColor: '#dee2ed'
          }]
        }
      }
    },
    methods: {
      removeLogo (event) {
        event.target.remove()
      }
    },
    async mounted () {
      this.$serviceWorker.addEventListener('message', this.load)
    }
  }
</script>

<style lang="scss">
  @import '../scss/vars';

  .balance {
    margin: 0 10px 20px;
    cursor: default;
    position: relative;
    background: white;
    box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.05);
    width: 100%;

    h4 {
      color: black;
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
      padding: 3px 15px;
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
      padding: 20px 10px 25px;
      line-height: 1.4rem;

      .balance-amount-value {
        text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
      }

      small {
        font-size: 0.4em;
        margin-right: 2px;
      }

      small, .balance-btc {
        text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
      }

      .balance-btc {
        display: inline-block;
        font-size: 0.8rem;
        vertical-align: middle;

        .dollar {
          font-weight: bold;
        }
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
