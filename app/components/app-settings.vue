<template>
  <div>
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
          "parameters": {
            "name": "My Bitcoin wallet",
            "address": "ADDRESS"
          }
        },
        {
          "network": "ethereum",
          "provider": "etherscan",
          "parameters": {
            "name": "My Ethereum wallet",
            "address": "ADDRESS"
          }
        },
        {
          "network": "iota",
          "provider": "native",
          "parameters": {
            "name": "My IOTA wallet",
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
    <textarea v-model="configuration" @input="updateConfiguration()" cols="100" rows="20"></textarea>
  </div>
</template>

<script>
  import Configurator from '../configurator'

  export default {
    name: 'app-settings',
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
      this.configuration = JSON.stringify(await Configurator.getConfiguration(), null, 2)
    }
  }
</script>
