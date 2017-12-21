<template>
  <aside>
    <p>notifications</p>
  </aside>
</template>

<script>
  export default {
    name: 'app-notifications'
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  aside {
    grid-area: notifications;
    background: lightpink;
    display: none;

    @media screen and (min-width: $breakpoint-medium) {
      display: block;
    }
  }
</style>
