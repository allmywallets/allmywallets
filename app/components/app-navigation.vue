<template>
  <nav>
    <router-link :to="{ name: 'home' }">Home</router-link>
    <router-link :to="{ name: 'settings' }">Settings</router-link>
  </nav>
</template>

<script>
  export default {
    name: 'app-navigation'
  }
</script>
