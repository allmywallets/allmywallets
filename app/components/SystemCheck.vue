<template>
  <collapsible-section icon="cogs" :class="{ 'warning': missing }">
    <translate slot="title">System checks</translate>
    <template slot="intro">
      <p v-if="!missing" v-translate>Your browser is compatible with AllMyWallets!</p>
      <p v-else>
        <translate>Some critical requirements are missing to get all the features of AllMyWallets.</translate><br />
        <translate>Please consider upgrading to the last version of one of the following browsers:</translate>
        <a href="https://www.google.com/chrome/">Chrome</a>,
        <a href="https://www.chromium.org/getting-involved/download-chromium">Chromium</a>,
        <a href="https://brave.com/download">Brave</a>,
        <a href="https://www.mozilla.org/firefox/">Firefox</a>
      </p>
    </template>
    <ul class="capabilities">
      <li v-for="capability in capabilities">
        <fa-icon
            :icon="capability.available ? 'check' : 'times'"
            :class="capability.available ? 'text-success' : 'text-danger'" />
        {{ capability.name }}
      </li>
    </ul>
  </collapsible-section>
</template>

<script>
  import { missingCapabilities, getCapabilities } from '../manager/system-manager'
  import CollapsibleSection from './CollapsibleSection.vue'

  export default {
    name: 'system-check',
    components: {
      CollapsibleSection
    },
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
