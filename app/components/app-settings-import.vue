<template>
  <div>
    <h2>Import settings</h2>
    <p>
      Paste the code on the following input field and press <span class="badge">Replace configuration</span> to update your configuration.
      <strong>Your configuration will be replaced by the new configuration and will be lost. You cannot undo this operation.</strong>
    </p>
    <input type="text" v-model="config" />
    <button @click.prevent="updateConfig">Replace configuration</button>
  </div>
</template>

<script>
  import LZString from 'lz-string'

  export default {
    name: 'app-settings-import',
    data () {
      return {
        config: ''
      }
    },
    methods: {
      updateConfig () {
        const config = JSON.parse(LZString.decompressFromEncodedURIComponent(this.config))

        return this.$store.dispatch('updateConfig', { config })
      }
    },
    mounted () {
      const { config } = this.$route.params

      if (config) {
        this.config = config
      }
    }
  }
</script>
