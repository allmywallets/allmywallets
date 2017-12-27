<template>
  <div v-if="state">
    <a href="#"
       @click.prevent="updateNotificationState"
       :title="state.title"
       :class="{ 'no-action': state.action === false }"
       v-tippy="{ showOnLoad: state.showOnLoad }"
    >
      <icon :icon="state.icon" :class="`text-${state.state}`"></icon>
    </a>
    <div class="counter" v-if="countNotifications > 0">{{ countNotifications }}</div>
  </div>
</template>

<script>
  import NotificationManager from '../notification-manager'

  export default {
    name: 'indicator-notifications',
    data () {
      return {
        state: null
      }
    },
    methods: {
      async updateNotificationState () {
        if (!this.state.action) {
          return
        }

        this.state.action(this.$serviceWorker)
        this.state = await this.getNotificationState()
      },
      async getNotificationState () {
        const registration = await this.$serviceWorker.getRegistration()
        const subscription = await registration.pushManager.getSubscription()

        return NotificationManager.getNotificationState(
          'Notification' in window,
          ['granted', 'denied'].includes(Notification.permission),
          Notification.permission === 'granted',
          subscription !== null
        )
      }
    },
    computed: {
      countNotifications () {
        return this.$store.state.notifications.length
      }
    },
    async mounted () {
      this.state = await this.getNotificationState()
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  div {
    position: relative;

    a {
      color: $color-section-notifications;

      &.no-action {
        cursor: default;
      }
    }

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
      cursor: default;
    }
  }
</style>
