<template>
  <div>
    <h2>System check</h2>
    <p v-if="!missing">Your browser is compatible with AllMyWallets!</p>
    <p v-else>
      Some critical requirements are missing to get all the features of AllMyWallets.<br />Please consider upgrading to the
      last version of <a href="https://www.google.com/chrome/">Chrome</a>, <a href="https://www.chromium.org/getting-involved/download-chromium">Chromium</a>,
      <a href="https://brave.com/download">Brave</a> or <a href="https://www.mozilla.org/firefox/">Firefox</a>.
    </p>
    <ul class="capabilities">
      <li v-for="capability in capabilities">
        <fa-icon
            :icon="capability.available ? 'check' : 'times'"
            :class="capability.available ? 'text-success' : 'text-danger'" />
        {{ capability.name }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { missingCapabilities, getCapabilities } from '../manager/system-manager'

  export default {
    name: 'system-check',
    data () {
      return {
        capabilities: {},
        missing: false
      }
    },
    mounted () {
      this.capabilities = getCapabilities()
      this.missing = missingCapabilities()
    }
  }
</script>

<style scoped lang="scss">
  .capabilities {
    text-align: left;
    list-style-type: none;
    padding-left: 15px;

    svg {
      width: 25px;
    }
  }
</style>
