<template>
  <div>
    <h2>Application settings</h2>
    <h3>Customization</h3>
    <p>TBD</p>
    <config-export></config-export>
    <config-expert></config-expert>
    <h2>Danger zone</h2>
    <a href="#" @click.prevent="forceUpdate">Force app update</a>
  </div>
</template>

<script>
  import ConfigExpert from './config-expert.vue'
  import ConfigExport from './config-export.vue'

  export default {
    name: 'app-settings',
    components: {
      ConfigExport,
      ConfigExpert
    },
    methods: {
      forceUpdate () {
        this.$serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister()
          }
        })
        location.reload()
      }
    }
  }
</script>
