<template>
  <div>
    <h2>Application settings</h2>
    <h3>Customization</h3>
    <p>TBD</p>
    <config-export></config-export>
    <config-import></config-import>
    <config-expert></config-expert>
    <h2>Danger zone</h2>
    <a href="#" @click.prevent="forceUpdate">Force app update</a>
  </div>
</template>

<script>
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
    methods: {
      forceUpdate () {
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
