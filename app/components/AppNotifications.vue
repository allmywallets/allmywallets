<template>
  <aside class="app-notifications">
    <p class="overall" v-if="notifications.length === 0">
      <fa-icon icon="inbox" /> <br /> You don't have any notifications.
    </p>
    <div class="notifications">
      <notification-item v-for="notification, key in notifications" :key="key" :notification="notification" />
    </div>
    <footer v-if="notifications.length > 0">
      <a href="#" @click.prevent="clearAllNotifications">
        <fa-icon icon="trash" /> Clear all notifications
      </a>
    </footer>
  </aside>
</template>

<script>
  import { mapGetters } from 'vuex'
  import NotificationItem from './NotificationItem.vue'

  export default {
    name: 'app-notifications',
    components: {
      NotificationItem
    },
    computed: {
      ...mapGetters([
        'notifications'
      ])
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
    background: $color-section-notifications;
    display: none;
    position: relative;
    border-left: 2px solid white;

    @media screen and (min-width: $breakpoint-medium) {
      display: block;
    }

    .overall {
      font-size: 1.1rem;
      line-height: 1.2rem;
      text-align: center;
      margin: 20px;
      color: $color-primary;

      svg {
        font-size: 1.6rem;
        margin-bottom: 5px;
      }
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
