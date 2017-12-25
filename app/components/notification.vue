<template>
  <div>
    <details class="notification-content">
      <summary class="notification-title">{{ notification.title }}</summary>
      {{ notification.content }}
    </details>
    <footer class="notification-footer">
      <span class="badge" v-if="wallet">{{ wallet.name }} ({{ wallet.network|camelcase }})</span>
      <time class="notification-date"><icon icon="clock"></icon> {{ notification.date|moment('from', 'now') }}</time>
    </footer>
  </div>
</template>

<script>
  import Notification from '../model/Notification'

  export default {
    name: 'notification',
    props: {
      notification: {
        type: Notification,
        required: true
      }
    },
    computed: {
      wallet () {
        return this.$store.state.config.profiles[0].wallets.find((wallet, key) => key === this.notification.walletId)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  div {
    font-size: 0.9rem;
    background: lighten($color-section-notifications, 3);
    margin: 2px 3px;
    padding: 10px;
    border-radius: 3px;

    .notification-content {
      font-size: 0.8rem;
      line-height: 0.95rem;

      .notification-title {
        margin-bottom: 3px;
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
      }
    }
    .notification-footer {
      font-size: 0.75rem;
      margin-top: 3px;

      .notification-date {
        font-style: italic;
      }
    }
  }
</style>
