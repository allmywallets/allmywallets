import Vue from 'vue'
import CurrencyFormatter from 'currency-formatter'

const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision)

  return Math.round(number * factor) / factor
}

Vue.filter('currency', (value, ticker) => {
  if (!CurrencyFormatter.currencies.find(currency => currency.code === ticker)) {
    return `${ticker} ${precisionRound(value, 4)}`
  }

  return CurrencyFormatter.format(value, { code: ticker })
})
