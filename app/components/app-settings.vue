<template>
  <div>
    <config-standard></config-standard>
    <hr />
    <config-expert></config-expert>
  </div>
</template>

<script>
  import ConfigStandard from './config-standard.vue'
  import ConfigExpert from './config-expert.vue'

  export default {
    components: {
      ConfigStandard,
      ConfigExpert
    },
    name: 'app-settings'
  }
</script>
