<template>
  <div>
    <h2 v-translate>Add a new wallet</h2>
    <p>
      <translate>You can add a new wallet by selecting a provider on the list below.</translate>
      <translate>A wallet is a set of balances which will be displayed on the homepage of AMW.</translate>
    </p>
    <label for="wallet-filter" v-translate>Filter:</label> <input type="search" id="wallet-filter" />
    <ul :class="{ 'selected': currentProvider !== '' }">
      <li v-for="provider in providers" :key="provider" :class="{ 'selected': currentProvider === provider }">
        <a href="#" @click.prevent="loadProvider(provider)">
          <span class="network">{{ provider.split('.')[0]|capitalize }}</span><br />
          <span class="provider">{{ provider.split('.')[1]|capitalize }}</span><br />
          <img src="https://www.weusecoins.com/images/company/kraken.png" alt="" />
        </a>
      </li>
    </ul>
    <template v-if="currentProvider !== ''">
      <h3 v-translate="{ provider: currentProvider.split('.')[1].charAt(0).toUpperCase() + currentProvider.split('.')[1].slice(1) }">
        Adding %{provider} wallet
      </h3>
      <form>
        <label for="name">Name</label>
        <input type="text" v-model="currentName" id="name" />
        <vue-form-generator :schema="currentSchema" :model="currentParameters" />
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
        this.currentSchema = { fields: await Proxy.getProviderParameters(provider) }
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

<style scoped lang="scss">
  @import '../scss/vars';

  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    background: white;
    box-shadow: 2px 3px 10px 0 rgba(0, 0, 0, 0.05);

    &.selected {
      li:not(.selected) {
        display: none;
      }
    }

    li {
      width: 50%;
      border-right: 1px solid #efefef;
      border-bottom: 1px solid #efefef;

      @media screen and(min-width: $breakpoint-medium) {
        width: 25%;
      }

      @media screen and(min-width: $breakpoint-large) {
        width: 20%;
      }

      @media screen and(min-width: $breakpoint-larger) {
        width: 14.285714286%;
      }

      &.selected {
        width: 100%;
      }

      a {
        color: $color-text;
        display: block;
        line-height: 1rem;
        text-align: center;
        padding: 10px 0;

        &:hover {
          background: darken(white, 2);
        }

        .network {
          font-style: italic;
        }

        .provider {
          font-weight: bold;
        }

        img {
          max-width: 50px;
          margin-top: 10px;
        }
      }
    }
  }
</style>
