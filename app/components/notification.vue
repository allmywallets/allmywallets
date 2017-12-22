<template>
  <div>
    <strong class="notification-title">{{ title }}</strong>
    <span class="notification-content">{{ content }}</span>
    <time class="notification-date"><icon icon="clock"></icon> {{ date|date('on %m/%d/%Y at %T') }}</time>
  </div>
</template>

<script>
  export default {
    name: 'notification',
    props: {
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
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
    padding: 5px 10px;
    border-radius: 3px;

    .notification-title {
      display: block;
      font-weight: bold;
    }
    .notification-content {
      display: block;
      font-size: 0.8rem;
      line-height: 0.95rem;
    }
    .notification-date {
      font-style: italic;
      font-size: 0.7rem;
    }
  }
</style>
