<template>
  <nav>
    <router-link :to="{ name: 'home' }">Home</router-link>
    <router-link :to="{ name: 'settings' }">Settings</router-link>
  </nav>
</template>

<script>
  export default {
    name: 'app-menu'
  }
</script>

<style scoped lang="scss">
  nav {
    grid-area: menu;
    background: lightblue;
  }
</style>
