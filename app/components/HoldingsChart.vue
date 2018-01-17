<script>
  import { Line, mixins } from 'vue-chartjs'

  export default {
    name: 'holdings-chart',
    extends: Line,
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
