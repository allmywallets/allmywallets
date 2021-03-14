import { formatCurrency } from "./manager/holdings-manager"

const filters = {
  install(Vue) {
    Vue.filter("currency", (value, ticker) => {
      return formatCurrency(value, ticker)
    })
  }
}

export default filters
