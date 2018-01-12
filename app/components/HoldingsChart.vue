<template>
  <div class="holdings-chart">
    <canvas ref="plot"></canvas>
  </div>
</template>

<script>
  import Chart from 'chart.js'

  const NB_DAYS = 45

  export default {
    name: 'holdings-chart',
    async mounted () {
      return fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=${NB_DAYS * 24 / 6}&aggregate=6&e=CCCAGG`)
        .then(response => response.json())
        .then(json => {
          const data = json.Data.map(d => d.close)

          new Chart(this.$refs.plot.getContext('2d'), {
            type: 'line',
            data: {
              labels: [...Array(NB_DAYS * 24 / 6).keys()],
              datasets: [{
                data: data,
                backgroundColor: '#dee2ed',
                borderColor: '#dee2ed'
              }]
            },
            options: {
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
          })
        })
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  canvas {
    height: 300px;
  }

  .holdings-chart {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
  }
</style>
