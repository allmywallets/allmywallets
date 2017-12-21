<template>
  <div>
    <icon v-if="!supported" icon="bell-slash" ref="unsupported" title="Notifications not supported" class="text-warning"></icon>
    <icon v-else-if="denied" icon="bell-slash"></icon>
    <icon v-else-if="granted" icon="bell"></icon>
    <a v-else @click.prevent="enableNotifications" ref="enable" href="#" title="Click here to enable notifications" class="text-info">
      <icon icon="bell-slash"></icon>
    </a>
  </div>
</template>

<script>
  import tippy from 'tippy.js'

  export default {
    name: 'notifications',
    data () {
      return {
        supported: 'Notification' in window,
        granted: Notification.permission === 'granted',
        denied: Notification.permission === 'denied'
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
      tippy('[title]', {
        animation: 'fade',
        arrow: true
      })

      if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
        this.$refs.enable._tippy.show()
      }
    }
  }
</script>
