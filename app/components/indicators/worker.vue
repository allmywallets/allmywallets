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
  import database from '../../database'
  import GlobalError from '../../errors/GlobalError'

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
        if (data.action !== 'sync') {
          return this.addError(new GlobalError(`Message action ${data.action} is not supported.`))
        }

        if (data.error) {
          return this.addError(data.error)
        }

        this.refreshBalance(await database.getBalance(data.walletId, data.currency), data.walletId)
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
