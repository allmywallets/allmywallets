<template>
  <article>
    <header class="notification-title">{{ notification.title }}</header>
    <div class="notification-content">{{ notification.content }}</div>
    <footer class="notification-footer">
      <span class="badge" v-if="wallet">{{ wallet.name }} ({{ wallet.network|camelcase }})</span>
      <time class="notification-date" :datetime="notification.date" :title="notification.date">
        <icon icon="clock"></icon> {{ notification.date|moment('from', 'now') }}
      </time>
    </footer>
  </article>
</template>

<script>
  import Notification from '../model/Notification'
  import { mapGetters } from 'vuex'

  export default {
    name: 'notification-item',
    props: {
      notification: {
        type: Notification,
        required: true
      }
    },
    computed: {
      ...mapGetters([
        'wallets'
      ]),
      wallet () {
        return this.wallets.find(wallet => wallet.id === this.notification.walletId)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  article {
    font-size: 0.9rem;
    background: lighten($color-section-notifications, 3);
    margin: 5px;
    padding: 5px;
    border-radius: 5px;

    .notification-title {
      font-weight: bold;
      font-size: 1rem;
      line-height: 1rem;
    }

    .notification-content {
      font-size: 0.8rem;
      line-height: 0.95rem;
    }

    .notification-footer {
      font-size: 0.7rem;
      margin-top: 5px;

      .notification-date {
        font-style: italic;
      }
    }
  }
</style>
