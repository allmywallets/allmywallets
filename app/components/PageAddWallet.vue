<template>
  <div>
    <h2 v-translate>Add a new wallet</h2>
    <p>
      <translate>You can add a new wallet by selecting a provider on the list below.</translate>
      <translate>A wallet is a set of balances which will be displayed on the homepage of AMW.</translate>
    </p>
    <article v-if="currentProvider === null">
      <provider-list-filters :providers="providerList" :networks="networkList" @filter="filterProviders" />
      <ul>
        <li v-for="provider in providers" :key="provider.network + '.' + provider.provider">
          <a href="#" @click.prevent="loadProvider(provider)">
            <span class="network">{{ provider.network|capitalize }}</span><br />
            <span class="provider">{{ provider.name }}</span><br />
          </a>
        </li>
      </ul>
    </article>
    <article v-else class="add-wallet">
      <h3>
        <translate :translate-params="{ provider: currentProvider.name }">Add a %{provider} wallet</translate>
      </h3>
      <p>
        {{ currentProvider.description }}<br />
        <a href="#" class="button button-small button-info" v-if="currentProvider.documentation" @click.prevent="$refs.modalProvider.open()">
          <fa-icon icon="question-circle" />
          <translate>Help</translate>
        </a>
        <a :href="currentProvider.url" target="_blank" class="button button-small">
          <fa-icon icon="globe" />
          <translate>View website</translate>
        </a>
      </p>
      <modal-provider
          ref="modalProvider"
          v-if="currentProvider.documentation"
          :provider="currentProvider.name"
          :url="currentProvider.documentation"
      />
      <template v-if="currentProvider.warnings">
        <p v-if="currentProvider.warnings.cors" class="alert alert-warning" v-translate>
          This provider is missing some requirements to work in a decentralized way (CORS support is missing). API
          requests will use an intermediate server owned by the AllMyWallets team.
        </p>
        <p v-if="currentProvider.warnings.apiKey" class="alert alert-warning" v-translate>
          AllMyWallets is not able to check if your API key is read only. Be sure that the provided
          key does not allow any trading, withdraw or other dangerous actions.
        </p>
      </template>
      <form>
        <label for="name" v-translate>Name of the wallet</label><br />
        <input type="text" v-model="currentName" id="name" />
        <vue-form-generator :schema="currentSchema" :model="currentParameters" />
        <button @click.prevent="save" class="button">
          <fa-icon icon="plus" />
          <translate>Add wallet</translate>
        </button>
        <button @click.prevent="reset" class="button button-warning">
          <fa-icon icon="trash" />
          <translate>Cancel</translate>
        </button>
      </form>
    </article>
  </div>
</template>

<script>
  import VueFormGenerator from 'vue-form-generator'
  import ProviderListFilters from './ProviderListFilters'
  import ModalProvider from './ModalProvider'
  import Proxy from '../providers'
  import { generateId } from '../helper/string'

  export default {
    name: 'page-add-wallet',
    components: {
      ProviderListFilters,
      ModalProvider
    },
    data () {
      return {
        currentName: '',
        currentSchema: null,
        currentProvider: null,
        currentParameters: null,
        filters: []
      }
    },
    computed: {
      providers () {
        if (this.filters.length === 0) {
          return Proxy.getProvidersList()
        }

        return Proxy.getProvidersList().filter(value => {
          for (const filter of this.filters) {
            if (filter.type === 'network' && value.network !== filter.name.toLowerCase()) {
              return false
            }

            if (filter.type === 'provider' && value.name !== filter.name) {
              return false
            }
          }

          return true
        })
      },
      providerList () {
        return this.providers.map(provider => {
          return {
            type: 'provider',
            name: provider.name
          }
        })
      },
      networkList () {
        return this.providers.map(provider => {
          return {
            type: 'network',
            name: provider.network.charAt(0).toUpperCase() + provider.network.slice(1)
          }
        }).filter((value, index, array) => array.map(mapObj => mapObj['name']).indexOf(value['name']) === index)
      }
    },
    methods: {
      filterProviders (filters) {
        this.filters = filters
      },
      async loadProvider (provider) {
        this.currentSchema = { fields: await Proxy.getProviderParameters(provider.network + '.' + provider.provider) }
        this.currentParameters = VueFormGenerator.schema.createDefaultObject(this.currentSchema)
        this.currentProvider = provider
      },
      async save () {
        // Change string "address1,address2" to array [address1, address2]
        // TODO: Do it directly with vue-form-generator
        if (this.currentParameters.addresses) {
          const addresses = this.currentParameters.addresses.split(',')
          this.currentParameters.addresses = addresses
        }
        if (this.currentParameters.wallets) {
          this.currentParameters.wallets = [this.currentParameters.wallets]
        }

        await this.$store.dispatch('addWallet', {
          wallet: {
            id: generateId(20),
            network: this.currentProvider.network,
            provider: this.currentProvider.provider,
            name: this.currentName,
            parameters: this.currentParameters
          }
        })

        this.reset()
      },
      reset () {
        this.currentSchema = null
        this.currentParameters = {}
        this.currentProvider = null
        this.filters = []
      }
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
    @include card();

    &.selected {
      display: none;
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

  form {
    padding: 10px 0;
  }

  .add-wallet {
    @include card();
    padding: 10px 20px;
  }
</style>
