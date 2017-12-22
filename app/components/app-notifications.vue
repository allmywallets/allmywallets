<template>
  <aside>
    <p class="overall">You don't have any notification.</p>
    <notification v-for="notification, key in notifications"
                  :key="key"
                  :title="notification.title"
                  :content="notification.content"
                  :date="notification.date"></notification>
  </aside>
</template>

<script>
  import Notification from './notification.vue'

  export default {
    name: 'app-notifications',
    components: {
      Notification
    },
    data () {
      return {
        notifications: []
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  aside {
    grid-area: notifications;
    color: white;
    background: $color-section-notifications;
    display: none;

    @media screen and (min-width: $breakpoint-medium) {
      display: block;
    }

    .overall {
      font-size: 0.85rem;
      text-align: center;
      margin: 5px 0;
    }
  }
</style>
