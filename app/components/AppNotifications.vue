<template>
  <aside :class="{ 'app-notifications': true, 'show-panel': display.notifications.panel }">
    <header class="actions">
      <a href="#" @click.prevent="clearAllNotifications" v-if="notifications.length > 0"><fa-icon icon="trash" /></a>
      <a href="#" @click.prevent="togglePanel" class="close-panel"><fa-icon icon="times" /></a>
    </header>
    <p class="overall" v-if="notifications.length === 0">
      <fa-icon icon="inbox" /> <br /> <translate>You don't have any notifications.</translate>
    </p>
    <div class="notifications">
      <notification-item v-for="notification, key in notifications" :key="key" :notification="notification" />
    </div>
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
        'notifications',
        'display'
      ])
    },
    methods: {
      togglePanel () {
        const display = this.display
        display.notifications.panel = !display.notifications.panel

        return this.$store.dispatch('updateDisplay', { display })
      },
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
    border-left: 2px solid white;
    position: absolute;
    z-index: 10000;
    width: $grid-notifications-width;
    height: 100%;
    box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.15);
    right: -$grid-notifications-width;
    transition: right .3s;

    &.show-panel {
      right: 0;
    }

    @media screen and (min-width: $breakpoint-medium) {
      position: relative;
      box-shadow: none;
      z-index: 0;
      right: 0;

      .close-panel {
        display: none;
      }
    }

    header {
      text-align: right;
      height: 35px;
      padding: 5px 10px;
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
  }
</style>
