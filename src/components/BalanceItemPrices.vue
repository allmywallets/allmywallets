<template>
  <span class="balance-price">
    <template v-if="pricesHistory && amount > 0">
      <template v-if="currencies.primary !== ticker">
        <span
          :class="{
            movement: true,
            decrease: pricesHistory.getLastMovement('primary') < 0
          }"
        >
          {{ pricesHistory.getLastMovement("primary") | toFixed(2) }}%
        </span>
        │ {{ currentValues.primary | currency(currencies.primary) }}
      </template>
      <template v-if="currencies.secondary !== ticker">
        ({{ currentValues.secondary | currency(currencies.secondary) }})
      </template>
    </template>
  </span>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "balance-item-prices",
  props: {
    ticker: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters(["pricesHistories", "currencies"]),
    pricesHistory() {
      const history = this.pricesHistories.find(
        history => history.ticker === this.ticker
      )

      if (history === null) {
        return false
      }

      return history
    },
    currentValues() {
      return this.pricesHistory.getCurrentValues(this.amount)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/vars";

.balance-price {
  display: inline-block;
  font-size: 0.8rem;
  vertical-align: middle;
  font-family: $font-default;
  min-height: 0.8rem;

  .dollar {
    font-weight: bold;
  }

  .movement {
    color: $color-success;

    &:before {
      content: "▲";
    }

    &.decrease {
      color: $color-danger;

      &:before {
        content: "▼";
      }
    }
  }
}
</style>
