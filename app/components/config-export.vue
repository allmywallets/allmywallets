<template>
  <div>
    <h3>Export configuration</h3>
    <p>
      You can export your configuration to another device by following the next steps. Notice that sync won't be triggered
      automatically, as your data is not saved on any external server. You will need to export configuration again on
      your other devices to get your configuration updated everywhere.
    </p>
    <template v-if="config.length < 2000">
      <p>
        You can scan the below QRCode:
      </p>
      <qrcode :value="url"></qrcode>
      <p>
        You can also copy the following url and access it on the target device:
      </p>
      <div class="url">{{ url }}</div>
    </template>
    <template v-else>
      <p>
        You can scan the below QRCode and copy the code that will be shown by your device at <a :href="importUrl">{{ importUrl }}</a>:
      </p>
      <qrcode :value="url"></qrcode>
      <p>
        You can also copy the following code and paste it on the target device at <a :href="importUrl">{{ importUrl }}</a>:
      </p>
      <div class="url">{{ config }}</div>
    </template>
  </div>
</template>

<script>
  import LZString from 'lz-string'

  export default {
    name: 'config-export',
    computed: {
      config () {
        return LZString.compressToEncodedURIComponent(JSON.stringify(this.$store.state.config))
      },
      url () {
        return `${this.importUrl}/${this.config}`
      }
    },
    data () {
      return {
        importUrl: `${window.location.origin}/settings/import`
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .url {
    max-width: 100%;
    overflow: auto;
    white-space: nowrap;
  }
</style>
