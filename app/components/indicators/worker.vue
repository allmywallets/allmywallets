<template>
  <div>
    <a v-if="needsRefresh" href="#" @click.prevent="refreshPage" title="App restart required" ref="refresh" v-tippy>
      <icon icon="cogs" class="text-danger"></icon>
    </a>
    <icon v-else icon="cogs" title="App working properly"></icon>
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

      if (this.needsRefresh) {
        this.$refs.refresh._tippy.show()
      }
    }
  }
</script>
