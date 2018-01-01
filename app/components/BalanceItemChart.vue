<template>
  <div>
    <canvas ref="plot"></canvas>
  </div>
</template>

<script>
  import Chart from 'chart.js'

  export default {
    name: 'balance-item-chart',
    props: {
      ticker: {
        type: String,
        required: true
      }
    },
    mounted () {
      const NB_DAYS = 10 // Todo: allow customization

      return fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${this.ticker}&tsym=USD&limit=${NB_DAYS * 24 / 6}&aggregate=6&e=CCCAGG`)
        .then(response => response.json())
        .then(json => {
          const data = json.Data.map(d => d.close)

          new Chart(this.$refs.plot.getContext('2d'), {
            type: 'line',
            data: {
              labels: [...Array(NB_DAYS * 24 / 6).keys()],
              datasets: [{
                data: data,
                backgroundColor: data[0] > data[NB_DAYS * 24 / 6 - 1] ? '#EAD1CB' : '#CBF0D6',
                borderColor: '#fafafa'
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
                point: { radius: 0 }
              }
            }
          })
        })
    }
  }
</script>
