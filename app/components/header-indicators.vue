<template>
  <div class="indicators">
    <worker class="indicator"></worker>
    <online class="indicator"></online>
    <notifications class="indicator"></notifications>
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
  @import '../scss/vars';

  .indicators {
    text-align: right;

    .indicator {
      padding: .3rem .5rem .1rem;
      display: inline-block;
      font-size: 1.1rem;
    }
  }
</style>
