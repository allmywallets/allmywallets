<template>
  <div class="app-indicators">
    <indicator-worker class="indicator"></indicator-worker>
    <indicator-online class="indicator"></indicator-online>
    <indicator-notifications class="indicator"></indicator-notifications>
  </div>
</template>

<script>
  import IndicatorWorker from './IndicatorWorker.vue'
  import IndicatorOnline from './IndicatorOnline.vue'
  import IndicatorNotifications from './IndicatorNotifications.vue'

  export default {
    name: 'app-indicators',
    components: {
      IndicatorWorker,
      IndicatorOnline,
      IndicatorNotifications
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .app-indicators {
    grid-area: indicators;
    display: flex;
    justify-content: center;
    text-align: center;

    @media screen and (min-width: $breakpoint-medium) {
      z-index: 2000;
      position: fixed;
      width: $grid-notifications-width;
      height: $grid-header-height;
      right: 0;
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
