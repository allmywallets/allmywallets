<template>
  <div>
    <h2>Add a new wallet</h2>
    <ul>
      <li v-for="provider in providers" :key="provider">
        <a href="#" @click.prevent="loadProvider(provider)">{{ provider }}</a>
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
  import { generateId } from '../helper/string'

  export default {
    name: 'page-add-wallet',
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
      async loadProvider (provider) {
        this.reset()
        this.currentSchema = { fields: await Proxy.getProviderParams(provider) }
        this.currentParameters = VueFormGenerator.schema.createDefaultObject(this.currentSchema)
        this.currentProvider = provider
      },
      async save () {
        const config = await Configurator.getConfig()
        const profile = config.profiles[0]

        if (!Object(profile).hasOwnProperty('wallets')) {
          profile.wallets = []
        }

        // Change string "address1,address2" to array [address1, address2]
        // TODO: Do it directly with vue-form-generator
        if (this.currentParameters.addresses) {
          const addresses = this.currentParameters.addresses.split(',')
          this.currentParameters.addresses = addresses
        }
        if (this.currentParameters.wallets) {
          this.currentParameters.wallets = [this.currentParameters.wallets]
        }

        const provider = this.currentProvider.split('.')
        profile.wallets.push({
          id: generateId(20),
          network: provider[0],
          provider: provider[1],
          name: this.currentName,
          parameters: this.currentParameters
        })

        await Configurator.setConfig(config)
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
