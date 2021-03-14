<template>
  <div class="balance-tools">
    <a
      href="#"
      class="address balance-tool"
      title="Public key copied!"
      :data-clipboard-text="balance.address"
      v-if="balance.address !== ''"
      v-tippy="{ trigger: 'click' }"
    >
      <fa-icon icon="copy" />
    </a>
    <a
      href="#"
      v-if="!display.balances.collapsed"
      @click.prevent="refresh"
      :title="`Updated ${lastUpdate} ago`"
      class="balance-tool"
      v-tippy
    >
      <fa-icon icon="sync-alt" :spin="loading" />
    </a>
    <a
      href="#"
      v-if="status"
      :title="`Wallet update failed: ${status.title}`"
      class="text-warning balance-tool"
      v-tippy
    >
      <fa-icon icon="exclamation-triangle" />
    </a>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Clipboard from "clipboard"
import distanceInWords from "date-fns/distance_in_words"
import Balance from "../model/Balance"

export default {
  name: "balance-item-tools",
  props: {
    balance: {
      type: Balance,
      required: true
    }
  },
  data() {
    return {
      now: new Date(),
      interval: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters(["notifications", "display"]),
    status() {
      return this.notifications.find(notification => {
        return (
          notification.level === "ERROR" &&
          notification.walletId === this.balance.wallet.id
        )
      })
    },
    lastUpdate() {
      return distanceInWords(this.balance.lastUpdate, this.now)
    }
  },
  watch: {
    balance(oldBalance, newBalance) {
      if (newBalance.lastUpdate === oldBalance.lastUpdate) {
        return
      }

      this.loading = false
    }
  },
  mounted() {
    new Clipboard(".address")
    this.refreshDateEverySecond()
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    async refresh() {
      this.loading = true

      return this.$serviceWorker.controller.postMessage({
        action: "balance-refresh",
        walletId: this.balance.wallet.id,
        currencies: [this.balance.ticker]
      })
    },
    refreshDateEverySecond() {
      this.interval = setInterval(() => {
        this.now = new Date()
      }, 60 * 1000)
    }
  }
}
</script>

<style scoped lang="scss">
.balance-tools {
  text-align: right;
  margin-right: 5px;

  .balance-tool {
    margin-left: 5px;
  }
}

input {
  display: none;
}
</style>
