<template>
  <collapsible-section
    icon="user-md"
    :class="{ warning: needsUpdate || this.error !== '' }"
  >
    <translate slot="title">Expert mode</translate>
    <p slot="intro">
      <translate
        >Expert mode allows you to update your raw configuration
        directly.</translate
      >
      <strong v-if="needsUpdate" v-translate
        >Configuration needs to be updated!</strong
      >
    </p>
    <p>
      <strong v-translate
        >Beware! Editing this configuration may break the application.</strong
      >
      <translate>Be sure to know what you are doing...</translate>
    </p>
    <p>
      <translate>
        The configuration require unique ids of 20 characters for each wallet to
        be generated. You can use some of the following ones if you are not
        inspired:
      </translate>
      <template v-for="n in 3"
        ><span class="badge" :key="n">{{ generateId() }}</span
        >&nbsp;</template
      >
    </p>
    <p v-translate>Current editable configuration:</p>
    <p class="error" v-if="error !== ''">{{ error }}</p>
    <textarea title="Edit your configuration" v-model="config"></textarea>
  </collapsible-section>
</template>

<script>
import ShortId from "shortid"
import Configurator from "../manager/configuration"
import CollapsibleSection from "./CollapsibleSection.vue"
import { migrate } from "../migrations/config"

export default {
  name: "config-expert",
  components: {
    CollapsibleSection
  },
  data() {
    return {
      error: "",
      timeout: 0
    }
  },
  computed: {
    config: {
      get() {
        return JSON.stringify(this.$store.state.config.config, null, 2)
      },
      async set(config) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(async () => {
          this.error = ""
          try {
            return this.$store.dispatch("init", {
              serviceWorker: this.$serviceWorker,
              config: migrate(JSON.parse(config))
            })
          } catch (e) {
            this.error = e.message
          }
        }, 500)
      }
    },
    needsUpdate() {
      return !Configurator.validateConfig(this.$store.state.config.config)
    }
  },
  methods: {
    generateId() {
      return ShortId.generate()
    }
  }
}
</script>

<style scoped lang="scss">
textarea {
  width: 100%;
  height: 300px;
}

pre {
  font-size: 0.8em;
  width: 100%;
  overflow: scroll;
}
</style>
