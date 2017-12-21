<template>
  <div>
    <h2>Add a new wallet</h2>
    <ul>
      <li v-for="key in Object.keys(providers)" :key="key">
        <a href="#" @click.prevent="loadProvider(key)">{{ key }}</a>
      </li>
    </ul>
    <template v-if="currentSchema !== null">
      <p>Adding a {{ currentProvider }}</p>
      <form>
        <label for="name">Name</label>
        <input type="text" v-model="currentName" id="name" />
        <vue-form-generator :schema="currentSchema" :model="currentParameters"></vue-form-generator>
        <button @click.prevent="save">Save</button>
      </form>
    </template>
  </div>
</template>

<script>
  import VueFormGenerator from 'vue-form-generator'
  import Proxy from '../providers'
  import Configurator from '../configurator'

  export default {
    name: 'config-standard',
    data () {
      return {
        providers: {},
        currentName: '',
        currentSchema: null,
        currentProvider: '',
        currentParameters: null
      }
    },
    methods: {
      loadProvider (provider) {
        this.reset()
        this.currentSchema = { fields: this.providers[provider].getSupportedParameters() }
        this.currentParameters = VueFormGenerator.schema.createDefaultObject(this.currentSchema)
        this.currentProvider = provider
      },
      async save () {
        const configuration = await Configurator.getConfiguration()
        const profile = configuration.profiles[0]

        if (!Object(profile).hasOwnProperty('wallets')) {
          profile.wallets = []
        }

        const provider = this.currentProvider.split('.')
        profile.wallets.push({
          network: provider[0],
          provider: provider[1],
          name: this.currentName,
          parameters: this.currentParameters
        })

        Configurator.setConfiguration(configuration)
        this.reset()
      },
      reset () {
        this.currentSchema = null
        this.currentParameters = {}
        this.currentProvider = ''
      }
    },
    mounted () {
      this.providers = Proxy.getProvidersList()
    }
  }
</script>
