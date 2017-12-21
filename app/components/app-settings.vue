<template>
  <div>
    <h2>Application settings</h2>
    <config-expert></config-expert>
  </div>
</template>

<script>
  import ConfigExpert from './config-expert.vue'

  export default {
    components: {
      ConfigExpert
    },
    name: 'app-settings'
  }
</script>
