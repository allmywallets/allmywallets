<template>
  <div>
    <h2 v-translate>Settings and configuration</h2>
    <p v-translate>You can use this page to customize AMW, or import/export your configuration.</p>
    <collapsible-section v-if="needsUpgrade">
      <translate slot="title">Application upgrade</translate>
      <p slot="intro">
        <strong v-translate>An upgrade is available!</strong> It is strongly recommended to update to benefit from bug and security
        fixes as well as new features.
        <a href="#" @click.prevent="forceUpgrade" v-translate>Click here to upgrade.</a>
      </p>
    </collapsible-section>
    <system-check class="collapsible" />
    <collapsible-section>
      <translate slot="title">Display customization</translate>
      <template slot="intro">Coming soon!</template>
    </collapsible-section>
    <config-export />
    <config-import />
    <config-expert />
    <collapsible-section>
      <translate slot="title">Danger zone</translate>
      <p v-translate slot="intro">Some dangerous actions you can do with the application.</p>
      <ul>
        <li>
          <a href="#" @click.prevent="forceUpgrade" v-translate>Force app upgrade:</a>
          <translate>
            The app will be entirely reinstalled, but data should be preserved. You may also want to remove and add back
            the application icon on your home screen to refresh the splash screen.
          </translate>
        </li>
      </ul>
    </collapsible-section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CollapsibleSection from './CollapsibleSection.vue'
  import ConfigExpert from './ConfigExpert.vue'
  import ConfigExport from './ConfigExport.vue'
  import ConfigImport from './ConfigImport.vue'
  import SystemCheck from './SystemCheck.vue'

  export default {
    name: 'page-settings',
    components: {
      CollapsibleSection,
      SystemCheck,
      ConfigExport,
      ConfigExpert,
      ConfigImport
    },
    computed: {
      ...mapGetters([
        'needsUpgrade'
      ])
    },
    methods: {
      forceUpgrade () {
        this.$serviceWorker.getRegistrations().then((registrations) => { // Todo: rework this and put it elsewhere
          for (const registration of registrations) {
            registration.unregister()
            // Todo: unregister from api
          }
        })
        window.location.href = '/upgraded'
      }
    }
  }
</script>
