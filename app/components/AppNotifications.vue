<template>
  <aside class="app-notifications">
    <p class="overall" v-if="notifications.length === 0">You don't have any notification.</p>
    <div class="notifications">
      <notification-item
        v-for="notification, key in notifications"
        :key="key"
        :notification="notification"
      ></notification-item>
    </div>
    <footer v-if="notifications.length > 0">
      <a href="#" @click.prevent="clearAllNotifications">
        <icon icon="trash"></icon> Clear all notifications
      </a>
    </footer>
  </aside>
</template>

<script>
  import NotificationItem from './NotificationItem.vue'

  export default {
    name: 'app-notifications',
    components: {
      NotificationItem
    },
    computed: {
      notifications () {
        return this.$store.state.notifications
      }
    },
    methods: {
      clearAllNotifications () {
        return this.$store.dispatch('clearAllNotifications')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .app-notifications {
    grid-area: notifications;
    color: white;
    background: $color-section-notifications;
    display: none;
    position: relative;

    @media screen and (min-width: $breakpoint-medium) {
      display: block;
    }

    .overall {
      font-size: 0.85rem;
      text-align: center;
      margin: 5px 0;
    }

    .notifications {
      max-height: 100%;
      overflow: auto;
      position: absolute;
      padding-bottom: 35px;
      width: 100%;
    }

    footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      font-size: 0.85rem;
      padding: 7px 0 7px;
      background: $color-section-notifications;
    }
  }
</style>
