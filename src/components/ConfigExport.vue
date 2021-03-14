<template>
  <collapsible-section icon="upload">
    <translate slot="title">Export configuration</translate>
    <p v-translate slot="intro">
      You can export your configuration to another device. Notice that you will
      need to export your configuration each time it is updated on a device to
      get your configuration updated everywhere, because your data is not saved
      on an external server.
    </p>
    <template v-if="config.length < 2000">
      <p v-translate>
        You can scan the below QRCode:
      </p>
      <qrcode :value="url" />
      <p v-translate>
        You can also copy the following url and access it on the target device:
      </p>
      <div class="url">{{ url }}</div>
    </template>
    <template v-else>
      <p>
        <translate
          >You can scan the below QRCode and copy the code that will be shown by
          your device at the address</translate
        >
        <a :href="importUrl">{{ importUrl }}</a
        >:
      </p>
      <qrcode :value="url" />
      <p>
        <translate
          >You can also copy the following code and paste it on the target
          device at the address</translate
        >
        <a :href="importUrl">{{ importUrl }}</a
        >:
      </p>
      <div class="url">{{ config }}</div>
    </template>
  </collapsible-section>
</template>

<script>
import LZString from "lz-string"
import CollapsibleSection from "./CollapsibleSection.vue"

export default {
  name: "config-export",
  components: {
    CollapsibleSection
  },
  data() {
    return {
      importUrl: window.location.href
    }
  },
  computed: {
    config() {
      return LZString.compressToEncodedURIComponent(
        JSON.stringify(this.$store.state.config)
      )
    },
    url() {
      return `${this.importUrl}/${this.config}`
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/vars";

.url {
  max-width: 100%;
  overflow: auto;
  white-space: nowrap;
}
</style>
