<script>
  import { Pie, mixins } from 'vue-chartjs'

  export default {
    name: 'pie-chart',
    extends: Pie,
    mixins: [mixins.reactiveProp],
    props: {
      chartData: {
        type: Object,
        required: true
      },
      options: {
        type: Object,
        required: true
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>
