<template>
  <div>
    <h3>Import settings</h3>
    <p>
      You've exported your configuration from another device? Paste the exported code on the following input field.
      <strong>Your configuration will be replaced by the new configuration and will be lost. You cannot undo this operation.</strong>
    </p>
    <p class="text-danger">
      Press <span class="badge">Replace configuration</span> to update your configuration.
    </p>
    <input type="text" v-model="config" title="Configuration exported code" placeholder="Copy paste configuration here" /> <br />
    <button @click.prevent="updateConfig" class="button">Replace configuration</button>
  </div>
</template>

<script>
  import LZString from 'lz-string'

  export default {
    name: 'config-import',
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
