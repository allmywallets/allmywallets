<template>
  <div>
    <h3>Expert mode</h3>
    <p>
      Expert mode allows you to update your raw configuration directly. Beware! Editing this configuration may break the
      application. Be sure to know what you are doing...
    </p>
    <p>Example:</p>
    <pre>
{
  "profiles": [{
    "wallets": [{
        "id": "random id (20 chars)",
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
        "id": "random id (20 chars)",
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
        "id": "random id (20 chars)",
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
    <span v-if="needsUpdate">Configuration needs to be updated!<br /></span>    </strong>
    Some ids to help you: <template v-for="n in 5"><span class="badge">{{ generateId() }}</span>&nbsp;</template>
    <textarea @input="updateConfig" title="Edit your configuration">{{ config }}</textarea>
  </div>
</template>

<script>
  import Configurator from '../configurator'
  import { generateId } from '../helper/string'

  export default {
    name: 'config-expert',
    data () {
      return {
        error: '',
        timeout: 0
      }
    },
    computed: {
      config () {
        return JSON.stringify(this.$store.state.config.config, null, 2)
      },
      needsUpdate () {
        return !Configurator.validateConfig(this.$store.state.config.config)
      }
    },
    methods: {
      async updateConfig (e) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => {
          this.error = ''
          try {
            const config = JSON.parse(e.target.value)
            await this.$store.dispatch('updateConfig', { config })
          } catch (e) {
            this.error = e.message
          }
        }, 500)
      },
      generateId () {
        return generateId(20)
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
