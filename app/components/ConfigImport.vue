<template>
  <collapsible-section icon="download">
    <translate slot="title">Import configuration</translate>
    <p slot="intro" v-translate>
      You've exported your configuration from another device?
    </p>
    <p>
      <translate>Paste the exported code on the following input field.</translate>
      <strong v-translate>Your configuration will be definitely overwritten by the new configuration. You cannot undo this operation.</strong>
    </p>
    <p class="text-danger">
      Press <span class="badge" v-translate>Replace configuration</span> to update your configuration.
    </p>
    <input type="text" v-model="config" title="Configuration exported code" placeholder="Copy paste configuration here" /> <br />
    <button @click.prevent="updateConfig" class="button" v-translate>Replace configuration</button>
  </collapsible-section>
</template>

<script>
  import LZString from 'lz-string'
  import CollapsibleSection from './CollapsibleSection.vue'

  export default {
    components: {CollapsibleSection},
    name: 'config-import',
    data () {
      return {
        config: ''
      }
    },
    methods: {
      updateConfig () {
        const config = JSON.parse(LZString.decompressFromEncodedURIComponent(this.config))

        return this.$store.dispatch('updateConfig', { config }) // Todo: use init app instead
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
