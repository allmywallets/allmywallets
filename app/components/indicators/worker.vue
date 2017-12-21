<template>
  <div>
    <a v-if="needsRefresh" href="#" @click.prevent="refreshPage" title="App restart required" ref="refresh">
      <icon icon="cogs" class="text-danger"></icon>
    </a>
    <icon v-else icon="cogs" title="App working properly"></icon>
  </div>
</template>

<script>
  import runtime from 'serviceworker-webpack-plugin/lib/runtime'
  import tippy from 'tippy.js'

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
      tippy('[title]', {
        animation: 'fade',
        arrow: true
      })

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
