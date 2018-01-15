<template>
  <div>
    <router-link v-if="missingCapabilities" :to="{ name: 'settings' }" title="Missing capabilities" v-tippy="{ showOnLoad: missingCapabilities }">
      <fa-icon icon="times" class="text-danger" />
    </router-link>
    <a v-else-if="needsRefresh" href="#" @click.prevent="refreshPage" title="App restart required" v-tippy="{ showOnLoad: needsRefresh }">
      <fa-icon icon="sync-alt" class="text-danger" />
    </a>
    <a v-else-if="needsUpgrade" href="#" @click.prevent="forceUpgrade" title="Click to upgrade" v-tippy="{ showOnLoad: needsUpgrade }">
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
        needsRefresh: this.$serviceWorker.controller === null
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
    methods: {
      refreshPage () {
        location.reload()
      },
      forceUpgrade () {
        this.$serviceWorker.getRegistrations().then((registrations) => { // Todo: rework this and put it elsewhere
          for (const registration of registrations) {
            registration.unregister()
            // Todo: unregister from api
          }
        })
        window.location.href = '/upgraded'
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
