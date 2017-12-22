<template>
  <div>
    <h2>Application settings</h2>
    <config-expert></config-expert>
    <h2>Danger zone</h2>
    <a href="#" @click.prevent="forceUpdate">Force app update</a>
  </div>
</template>

<script>
  import ConfigExpert from './config-expert.vue'

  export default {
    name: 'app-settings',
    components: {
      ConfigExpert
    },
    methods: {
      forceUpdate () {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister()
          }
        })
        location.reload()
      }
    }
  }
</script>
