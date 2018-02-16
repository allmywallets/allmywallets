<template>
  <article>
    <header class="notification-title">{{ notification.title }}</header>
    <div class="notification-content">{{ notification.content }}</div>
    <footer class="notification-footer">
      <span class="badge" v-if="wallet">{{ wallet.name }} ({{ wallet.network|camelcase }})</span>
      <time class="notification-date" :datetime="notification.date" :title="notification.date">
        <fa-icon icon="clock" /> {{ date }}
      </time>
    </footer>
  </article>
</template>

<script>
  import { mapGetters } from 'vuex'
  import distanceInWords from 'date-fns/distance_in_words'
  import Notification from '../src/model/Notification'

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
      },
      date () {
        return distanceInWords(this.notification.date, new Date())
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/scss/vars';

  article {
    font-size: 0.9rem;
    background: white;
    box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.05);
    margin: 5px;
    padding: 5px;

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
