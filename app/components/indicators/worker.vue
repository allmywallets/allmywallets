<template>
  <div>
    <a v-if="needsRefresh" href="#" @click.prevent="refreshPage" title="App restart required" ref="refresh" v-tippy>
      <icon icon="sync-alt" class="text-danger"></icon>
    </a>
    <icon v-else icon="cogs" title="App working properly" v-tippy></icon>
  </div>
</template>

<script>
  import runtime from 'serviceworker-webpack-plugin/lib/runtime'
  import Notification from '../../model/Notification'

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
      },
      async handleMessage ({ data }) {
        if (data.error) {
          const notification = Notification.fromObject(data.error)

          return this.$store.dispatch('addNotification', { notification })
        }

        const { balanceIds } = data

        return this.$store.dispatch('reloadBalances', { balanceIds })
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

      this.$serviceWorker.addEventListener('message', this.handleMessage)
    }
  }
</script>
