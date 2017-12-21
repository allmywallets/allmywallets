<template>
  <div>
    <template v-if="!supported">
      <icon icon="bell-slash"></icon>
    </template>
    <template v-else>
      <a href="#" @click.prevent="enableNotifications">
        <icon icon="bell"></icon>
      </a>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'notifications',
    data () {
      return {
        supported: 'Notification' in window
      }
    },
    methods: {
      enableNotifications () {
        if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
          Notification.requestPermission()
        }
      }
    }
  }
</script>
