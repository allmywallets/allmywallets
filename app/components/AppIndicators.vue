<template>
  <div class="app-indicators">
    <indicator-system class="indicator" />
    <indicator-online class="indicator" />
    <indicator-notifications class="indicator" />
  </div>
</template>

<script>
  import IndicatorSystem from './IndicatorSystem.vue'
  import IndicatorOnline from './IndicatorOnline.vue'
  import IndicatorNotifications from './IndicatorNotifications.vue'

  export default {
    name: 'app-indicators',
    components: {
      IndicatorSystem,
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
    box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.15);
    background: $color-section-menu;

    @media screen and (min-width: $breakpoint-medium) {
      z-index: 2000;
      position: fixed;
      width: $grid-notifications-width;
      height: $grid-header-height;
      right: 0;
      box-shadow: none;
    }

    .indicator {
      font-size: 1.1rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 0 1.5rem;
      color: $color-primary;
    }
  }
</style>
