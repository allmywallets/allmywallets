<template>
  <div>
    <router-link v-if="missingCapabilities" :to="{ name: 'settings' }" title="Missing capabilities" v-tippy="{ showOnLoad: missingCapabilities }">
      <fa-icon icon="times" class="text-danger" />
    </router-link>
    <a v-else-if="needsRefresh" href="#" @click.prevent="refreshPage" title="App restart required" v-tippy="{ showOnLoad: needsRefresh }">
      <fa-icon icon="sync-alt" class="text-danger" />
    </a>
    <a v-else-if="needsUpgrade" href="#" @click.prevent="upgrade" title="Click to upgrade" v-tippy="{ showOnLoad: needsUpgrade }">
      <fa-icon icon="arrow-alt-circle-up" class="text-warning" />
    </a>
    <fa-icon v-else icon="check" title="App working properly" v-tippy />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import runtime from 'serviceworker-webpack-plugin/lib/runtime'
  import Notification from '../model/Notification'
  import { missingCapabilities } from '../manager/system-manager'

  export default {
    name: 'indicator-system',
    data () {
      return {
        needsRefresh: this.$serviceWorker && this.$serviceWorker.controller === null
      }
    },
    computed: {
      ...mapGetters([
        'needsUpgrade'
      ]),
      missingCapabilities () {
        return missingCapabilities()
      }
    },
    mounted () {
      if (!this.$serviceWorker) {
        return
      }

      runtime.register()
      this.$serviceWorker.addEventListener('controllerchange', () => {
        this.needsRefresh = this.$serviceWorker.controller === null
      })

      this.$serviceWorker.addEventListener('message', ({ data }) => {
        switch (data.action) {
          case 'balance-refresh':
            return this.balanceRefreshed(data)
          case 'app-upgrade':
            return this.appUpgraded(data)
        }
      })
    },
    methods: {
      refreshPage () {
        location.reload()
      },
      upgrade () {
        return this.$store.dispatch('appUpgrade', { serviceWorker: this.$serviceWorker })
      },
      appUpgraded () {
        window.location.href = '/upgraded'
      },
      async balanceRefreshed (data) {
        if (data.error) {
          const notification = Notification.fromObject(data.error)

          return this.$store.dispatch('addNotification', { notification })
        }

        const { balanceIds } = data

        return this.$store.dispatch('reloadBalances', { balanceIds })
      }
    }
  }
</script>
