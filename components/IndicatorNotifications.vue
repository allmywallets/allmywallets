<template>
  <div v-if="state">
    <a
      href="#"
      @click.prevent="updateNotificationState"
      :title="state.title"
      :class="{ 'no-action': state.action === false }"
      v-tippy="{ showOnLoad: state.showOnLoad }"
    >
      <fa-icon :icon="loading ? 'spinner' : state.icon" :spin="loading" :class="`text-${state.state}`" />
    </a>
    <div class="counter" v-if="countNotifications > 0">
      {{ countNotifications }}
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as Subscription from '../src/notification/subscription'

  export default {
    name: 'indicator-notifications',
    data () {
      return {
        state: null,
        loading: false
      }
    },
    computed: {
      ...mapGetters([
        'display'
      ]),
      countNotifications () {
        return this.$store.state.notifications.length
      }
    },
    async mounted () {
      this.state = await this.getNotificationState()
    },
    methods: {
      togglePanel () {
        const display = this.display
        display.notifications.panel = !display.notifications.panel

        return this.$store.dispatch('updateDisplay', { display })
      },
      async updateNotificationState () {
        if (!this.state.action) {
          return this.togglePanel()
        }

        this.loading = true
        await this.state.action(this.$serviceWorker)
        this.state = await this.getNotificationState()
        this.loading = false
      },
      async getNotificationState () {
        if (!this.$serviceWorker) {
          return Subscription.getNotificationState(false)
        }

        const registration = await this.$serviceWorker.getRegistration()
        const subscription = await registration.pushManager.getSubscription()

        return Subscription.getNotificationState(
          'Notification' in window,
          ['granted', 'denied'].includes(Notification.permission) && subscription,
          Notification.permission !== 'denied'
        )
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/scss/vars';

  div {
    position: relative;

    a {
      color: white;
    }

    @media screen and(min-width: $breakpoint-medium) {
      a.no-action {
        cursor: default;
      }
    }

    .counter {
      position: absolute;
      right: 1.1rem;
      top: 0.8rem;
      border-radius: 1em;
      background: $color-warning;
      font-weight: bold;
      font-size: 0.7rem;
      width: 15px;
      color: white;
      height: 15px;
      cursor: default;
    }
  }
</style>
