<template>
  <div class="indicators">
    <worker></worker>
    <online></online>
    <notifications></notifications>
  </div>
</template>

<script>
  import Worker from './indicators/worker.vue'
  import Online from './indicators/online.vue'
  import Notifications from './indicators/notifications.vue'

  export default {
    name: 'header-indicators',
    components: {
      Worker,
      Online,
      Notifications
    }
  }
</script>

<style scoped lang="scss">
  .indicators div {
    display: inline-block;
  }
</style>
