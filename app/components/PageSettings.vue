<template>
  <div>
    <template v-if="needsUpgrade">
      <h2>App upgrade</h2>
      <p>
        An upgrade is available!
        <a href="#" @click.prevent="forceUpgrade">Upgrade</a>
      </p>
    </template>
    <h2>Application settings</h2>
    <h3>Customization</h3>
    <p>TBD</p>
    <config-export></config-export>
    <config-import></config-import>
    <config-expert></config-expert>
    <h2>Danger zone</h2>
    <a href="#" @click.prevent="forceUpgrade">Force app upgrade</a>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ConfigExpert from './ConfigExpert.vue'
  import ConfigExport from './ConfigExport.vue'
  import ConfigImport from './ConfigImport.vue'

  export default {
    name: 'page-settings',
    components: {
      ConfigExport,
      ConfigExpert,
      ConfigImport
    },
    computed: {
      ...mapGetters([
        'needsUpgrade'
      ])
    },
    methods: {
      forceUpgrade () {
        this.$serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister()
            // Todo: unregister from api
          }
        })
        location.reload()
      }
    }
  }
</script>
