<template>
  <div>
    <template v-if="!supported">
      <icon icon="bell-slash" ref="unsupported" title="Notifications not supported" class="text-warning"></icon>
    </template>
    <template v-else-if="denied">
      <icon icon="bell-slash"></icon>
    </template>
    <template v-else-if="granted">
      <icon icon="bell"></icon>
    </template>
    <template v-else>
      <a href="#" @click.prevent="enableNotifications" ref="enable" title="Click here to enable notifications" class="text-info">
        <icon icon="bell-slash"></icon>
      </a>
    </template>
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
