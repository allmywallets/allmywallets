<template>
  <div>
    <icon v-if="!supported" icon="bell-slash" title="Browser notifications not supported" class="text-warning" v-tippy></icon>
    <icon v-else-if="denied" icon="bell-slash" title="Browser notifications are disabled" v-tippy></icon>
    <icon v-else-if="granted" icon="bell"></icon>
    <a v-else @click.prevent="enableNotifications" ref="enable" href="#" title="Click to enable browser notifications" class="text-info" v-tippy>
      <icon icon="bell-slash"></icon>
    </a>
    <div class="counter" v-if="countNotifications > 0">{{ countNotifications }}</div>
  </div>
</template>

<script>
  export default {
    name: 'indicator-notifications',
    data () {
      return {
        supported: 'Notification' in window,
        granted: Notification.permission === 'granted',
        denied: Notification.permission === 'denied'
      }
    },
    computed: {
      countNotifications () {
        return this.$store.state.notifications.length
      }
    },
    methods: {
      enableNotifications () {
        Notification.requestPermission().then((result) => {
          if (result === 'denied') {
            this.denied = true
          }
          if (result === 'granted') {
            this.granted = true
          }
        })
      }
    },
    mounted () {
      if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
        this.$refs.enable._tippy.show()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  div {
    position: relative;

    .counter {
      position: absolute;
      right: 1.1rem;
      top: 0.8rem;
      border-radius: 1em;
      background: $color-info;
      font-size: 0.7rem;
      width: 15px;
      color: white;
      height: 15px;
    }
  }
</style>
