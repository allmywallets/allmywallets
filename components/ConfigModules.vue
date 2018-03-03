<template>
  <collapsible-section icon="cubes">
    <translate slot="title">Modules</translate>
    <template slot="intro">
      You currently have {{ modules.length }} modules installed:
      <template v-for="module in modules">{{ module.name }}</template>
    </template>
    <p><span class="badge badge-light" v-translate>Configuration available soon...</span></p>
  </collapsible-section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CollapsibleSection from './CollapsibleSection.vue'

  export default {
    name: 'config-modules',
    components: {
      CollapsibleSection
    },
    computed: {
      ...mapGetters([
        'modules'
      ])
    }
  }
</script>
