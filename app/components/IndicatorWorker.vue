<template>
  <div>
    <a v-if="needsRefresh" href="#" @click.prevent="refreshPage" title="App restart required" v-tippy="{ showOnLoad: needsRefresh }">
      <fa-icon icon="sync-alt" class="text-danger" />
    </a>
    <fa-icon v-else icon="check" title="App working properly" v-tippy />
  </div>
</template>

<script>
  import runtime from 'serviceworker-webpack-plugin/lib/runtime'
  import Notification from '../model/Notification'

  export default {
    name: 'indicator-worker',
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

      this.$serviceWorker.addEventListener('message', this.handleMessage)
    }
  }
</script>
