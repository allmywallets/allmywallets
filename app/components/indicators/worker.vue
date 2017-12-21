<template>
  <div>
    <icon icon="cogs"></icon>
    <a v-if="needsRefresh" href="#" @click.prevent="refreshPage">PLEASE REFRESH THE PAGE</a>
  </div>
</template>

<script>
  import runtime from 'serviceworker-webpack-plugin/lib/runtime'

  export default {
    name: 'worker',
    data () {
      return {
        needsRefresh: this.$serviceWorker.controller === null
      }
    },
    methods: {
      refreshPage () {
        location.reload()
      }
    },
    mounted () {
      runtime.register()
      this.$serviceWorker.addEventListener('controllerchange', () => {
        this.needsRefresh = this.$serviceWorker.controller === null
      })
    }
  }
</script>
