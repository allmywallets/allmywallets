<script>
  import { Pie, mixins } from 'vue-chartjs'

  export default {
    name: 'pie-chart',
    extends: Pie,
    mixins: [mixins.reactiveProp],
    props: {
      chartData: {
        required: true
      },
      options: {
        required: true
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>
