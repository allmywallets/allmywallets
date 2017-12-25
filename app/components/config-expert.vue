<template>
  <div>
    <h3>Expert mode</h3>
    You can put as many wallets as you want.
    <p>Example:</p>
    <pre>
{
  "profiles": [{
    "wallets": [{
        "network": "bitcoin",
        "provider": "blockexplorer",
        "name": "My Bitcoin wallet",
        "parameters": {
          "addresses": [
            "ADDRESS"
          ]
        }
      },
      {
        "network": "ethereum",
        "provider": "etherscan",
        "name": "My Ethereum wallet",
        "parameters": {
          "addresses": [
            "ADDRESS"
          ],
          "currencies": [
            "ETH",
            "BAT",
            "IND"
          ],
          "explorerSpecific": {
            "customTokens": {
              "IND": {
                "name": "Indorse",
                "ticker": "IND",
                "decimals": 18,
                "contractAddress": "0xf8e386eda857484f5a12e4b5daa9984e06e73705"
              }
            }
          }
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
  }]
}
  </pre>
    <p>Current (editable) config:</p>
    <strong>{{ error }} <br />
          <span v-if="needsUpdate">Configuration needs to be updated!</span>
    </strong>
    <textarea @input="updateConfiguration" title="Edit your configuration">{{ configuration }}</textarea>
  </div>
</template>

<script>
  import Configurator from '../configurator'

  export default {
    name: 'config-expert',
    data () {
      return {
        error: '',
        timeout: 0
      }
    },
    computed: {
      configuration () {
        return JSON.stringify(this.$store.state.configuration, null, 2)
      },
      needsUpdate () {
        return !Configurator.validateConfiguration(this.$store.state.configuration)
      }
    },
    methods: {
      async updateConfiguration (e) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => {
          this.error = ''
          try {
            await this.$store.dispatch('updateConfiguration', JSON.parse(e.target.value))
          } catch (e) {
            this.error = e.message
          }
        }, 500)
      }
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
