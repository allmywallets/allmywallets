<template>
  <div>
    <h2>Statistics</h2>
    <p>
      <span class="badge badge-light" v-translate>Available soon...</span>
      <stats-portfolio/>
    </p>
  </div>
</template>

<script>
import StatsPortfolio from './StatsPortfolio.vue'

  export default {
    name: 'page-statistics',
    components: {
      StatsPortfolio
    }
  }
</script>
