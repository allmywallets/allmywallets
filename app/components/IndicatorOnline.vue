<template>
  <div>
    <icon icon="wifi" :class="{ 'text-danger': !online }" :title="getTitle()" v-tippy="{ showOnLoad: !this.online }"></icon>
  </div>
</template>

<script>
  export default {
    name: 'indicator-online',
    data () {
      return {
        online: navigator.onLine
      }
    },
    methods: {
      getTitle () {
        return this.online ? 'The app is online' : 'The app is offline'
      }
    },
    mounted () {
      window.addEventListener('offline', () => {
        this.online = false
      })
      window.addEventListener('online', () => {
        this.online = true
      })
    }
  }
</script>
