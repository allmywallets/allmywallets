import Vue from 'vue'
import CurrencyFormatter from 'currency-formatter'

Vue.filter('currency', (value, ticker) => {
  if (!CurrencyFormatter.currencies.find(currency => currency.code === ticker)) {
    return `${ticker} ${value}`
  }

  return CurrencyFormatter.format(value, { code: ticker })
})
