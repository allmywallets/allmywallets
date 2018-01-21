import Vue from 'vue'
import { formatCurrency } from './manager/holdings-manager'

Vue.filter('currency', (value, ticker) => {
  return formatCurrency(value, ticker)
})
