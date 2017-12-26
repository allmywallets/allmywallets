<template>
  <div>
    <h3>Export configuration</h3>
    <p>
      You can export your configuration to another device. Notice that you will need to export your configuration each
      time it is updated on a device to get your configuration updated everywhere, because your data is not saved on
      an external server.
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
        importUrl: window.location.href
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
