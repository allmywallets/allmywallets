<template>
  <div>
    <icon :icon="getIcon()" :class="{ 'offline': !online }"></icon>
  </div>
</template>

<script>
  export default {
    name: 'online',
    data () {
      return {
        online: true
      }
    },
    methods: {
      getIcon () {
        return this.online ? 'link' : 'unlink'
      }
    },
    mounted () {
      window.addEventListener('offline', () => { this.online = false })
      window.addEventListener('online', () => { this.online = true })
    }
  }
</script>

<style scoped lang="scss">
  .offline {
    color: red;
  }
</style>
