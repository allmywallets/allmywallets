<template>
  <div>
    <icon :icon="getIcon()" :class="{ 'text-warning': !online }" :title="getTitle()" ref="connectivity" v-tippy></icon>
  </div>
</template>

<script>
  export default {
    name: 'online',
    data () {
      return {
        online: navigator.onLine
      }
    },
    methods: {
      getIcon () {
        return this.online ? 'link' : 'unlink'
      },
      getTitle () {
        return this.online ? 'The app is online' : 'The app is offline'
      }
    },
    mounted () {
      if (!this.online) {
        this.$refs.connectivity._tippy.show()
      }

      window.addEventListener('offline', () => {
        this.online = false
        this.$refs.connectivity._tippy.show()
      })
      window.addEventListener('online', () => {
        this.online = true
        this.$refs.connectivity._tippy.hide()
      })
    }
  }
</script>
