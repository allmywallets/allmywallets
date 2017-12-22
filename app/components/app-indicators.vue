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
    grid-area: indicators;
    display: flex;
    justify-content: flex-end;

    @media screen and (min-width: $breakpoint-medium) {
      z-index: 2000;
      position: fixed;
      width: $grid-notifications-width;
      height: $grid-header-height;
      justify-content: center;
      right: 0;
      text-align: center;
    }

    .indicator {
      font-size: 1.1rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 0 1.5rem;
      color: $color-section-notifications;
    }
  }
</style>
