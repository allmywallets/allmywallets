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
          "currency": "bitcoin",
          "provider": "blockexplorer",
          "parameters": {
            "name": "My Bitcoin wallet",
            "address": "ADDRESS"
          }
        },
        {
          "currency": "ethereum",
          "provider": "etherscan",
          "parameters": {
            "name": "My Ethereum wallet",
            "address": "ADDRESS"
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
  import Storage from '../storage'

  export default {
    name: 'app-settings',
    data () {
      return {
        configuration: '',
        error: ''
      }
    },
    methods: {
      updateConfiguration () {
        try {
          Storage.configuration = JSON.parse(this.configuration)
          this.error = ''
        } catch (e) {
          this.error = e.message
        }
      }
    },
    mounted () {
      this.configuration = JSON.stringify(Storage.configuration, null, 2)
    }
  }
</script>
