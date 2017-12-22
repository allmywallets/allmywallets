<template>
  <div>
    <h3>Expert mode</h3>
    You can put as many wallets as you want.
    <p>Example:</p>
    <pre>
{
  "profiles": [
    {
      "wallets": [
        {
          "network": "bitcoin",
          "provider": "blockexplorer",
          "name": "My Bitcoin wallet",
          "parameters": {
            "address": "ADDRESS"
          }
        },
        {
          "network": "ethereum",
          "provider": "etherscan",
          "name": "My Ethereum wallet",
          "parameters": {
            "address": "ADDRESS",
            "tokens": ["POWR"],
            "customTokens": [
              {
                "name": "Indorse",
                "ticker": "IND",
                "decimals": 18,
                "contractAddress": "0xf8e386eda857484f5a12e4b5daa9984e06e73705"
              }
            ]
          }
        },
        {
          "network": "iota",
          "provider": "native",
          "name": "My IOTA wallet",
          "parameters": {
            "address": "ADDRESS",
            "node": "https://iota.thathost.net"
          }
        }
      ]
    }
  ]
}
  </pre>
    <p>Current (editable) config:</p>
    <strong>{{ error }} <br /></strong>
    <textarea v-model="configuration" @input="updateConfiguration()"></textarea>
  </div>
</template>

<script>
  import Configurator from '../configurator'

  export default {
    name: 'config-expert',
    data () {
      return {
        configuration: '',
        error: ''
      }
    },
    methods: {
      async updateConfiguration () {
        try {
          await Configurator.setConfiguration(JSON.parse(this.configuration))
          this.error = ''
        } catch (e) {
          this.error = e.message
        }
      }
    },
    async mounted () {
      const configuration = await Configurator.getConfiguration()
      this.configuration = JSON.stringify(configuration, null, 2)
      this.error = !Configurator.validateConfiguration(configuration) ? 'Configuration needs to be updated!' : ''
    }
  }
</script>

<style scoped lang="scss">
  textarea {
    width: 100%;
    height: 300px;
  }

  pre {
    font-size: 0.8em;
    width: 100%;
    overflow: scroll;
  }
</style>
