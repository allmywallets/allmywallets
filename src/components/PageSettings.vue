<template>
  <div>
    <h2 v-translate>Settings and configuration</h2>
    <p v-translate>
      You can use this page to customize AMW, or import/export your
      configuration.
    </p>
    <div class="sections">
      <collapsible-section
        v-if="needsUpgrade"
        class="warning"
        icon="arrow-alt-circle-up"
      >
        <translate slot="title">Application upgrade</translate>
        <p slot="intro">
          <strong v-translate>An upgrade is available!</strong>
          <translate
            >It is strongly recommended to update to benefit from bug and
            security fixes as well as new features.</translate
          >
          <a href="#" @click.prevent="upgrade(false)" v-translate
            >Click here to upgrade.</a
          >
        </p>
      </collapsible-section>
      <system-check class="collapsible" />
      <collapsible-section icon="desktop">
        <translate slot="title">Display customization</translate>
        <template slot="intro">
          <span class="badge badge-light" v-translate>Available soon...</span>
        </template>
      </collapsible-section>
      <config-modules />
      <config-export />
      <config-import />
      <config-expert />
      <collapsible-section icon="bomb">
        <translate slot="title">Danger zone</translate>
        <p v-translate slot="intro">
          Some dangerous actions you can do with the application.
        </p>
        <ul>
          <li>
            <a href="#" @click.prevent="upgrade(true)" v-translate
              >Force app upgrade:</a
            >
            <translate>
              The app will be entirely reinstalled, but data should be
              preserved. You may also want to remove and add back the
              application icon on your home screen to refresh the splash screen.
            </translate>
          </li>
        </ul>
      </collapsible-section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import CollapsibleSection from "./CollapsibleSection.vue"
import ConfigModules from "./ConfigModules.vue"
import ConfigExpert from "./ConfigExpert.vue"
import ConfigExport from "./ConfigExport.vue"
import ConfigImport from "./ConfigImport.vue"
import SystemCheck from "./SystemCheck.vue"

export default {
  name: "page-settings",
  components: {
    CollapsibleSection,
    SystemCheck,
    ConfigModules,
    ConfigExport,
    ConfigExpert,
    ConfigImport
  },
  computed: {
    ...mapGetters(["needsUpgrade"])
  },
  methods: {
    async upgrade(force) {
      await this.$store.dispatch("appUpgrade", {
        serviceWorker: this.$serviceWorker
      })

      this.$serviceWorker.addEventListener("message", ({ data }) => {
        if (data.action !== "app-upgrade") {
          return
        }

        if (force) {
          this.$serviceWorker.getRegistrations().then(registrations => {
            for (const registration of registrations) {
              registration.unregister()
              // Todo: unregister from api
            }
          })
        }

        window.location.href = "/upgraded"
      })
    }
  }
}
</script>
