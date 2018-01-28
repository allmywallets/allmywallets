<template>
  <multiselect
      v-model="filterTest"
      :options="filterOptions"
      :multiple="true"
      group-values="options"
      group-label="name"
      label="name"
      track-by="name"
      placeholder="Click and type to filter providers"
      class="provider-list-filter"
      @input="filterProviders"
  >
    <template slot="tag" slot-scope="props">
      <span class="badge badge-light"><span>
        {{ props.option.name }}</span> <fa-icon icon="times" @click="props.remove(props.option)" />
      </span>&nbsp;
    </template>
    <template slot="option" slot-scope="props">
      <template v-if="props.option.$isLabel">
        {{ props.option.$groupLabel }}
      </template>
      <template v-else>
        {{props.option.name }}
      </template>
    </template>
  </multiselect>
</template>

<script>
  import Multiselect from 'vue-multiselect'

  export default {
    name: 'provider-list-filters',
    props: {
      networks: {
        type: Array,
        required: true
      },
      providers: {
        type: Array,
        required: true
      }
    },
    components: {
      Multiselect
    },
    methods: {
      filterProviders (values) {
        this.$emit('filter', values)
      }
    },
    data () {
      return {
        filterOptions: [
          {
            name: 'Networks',
            value: '',
            options: this.networks
          },
          {
            name: 'Providers',
            value: '',
            options: this.providers
          }
        ],
        filterTest: ''
      }
    }
  }
</script>

<style lang="scss">
  @import '../scss/vars';

  .provider-list-filter {
    margin-bottom: 15px;
    @include card();

    .multiselect__input, .multiselect__tags {
      background: none;
      border: none;
    }

    .multiselect__option--highlight {
      background: $color-section-notifications;
      color: $color-text;
    }

    .multiselect__option--highlight::after {
      background: none;
      color: #777777;
    }

    .multiselect__option.multiselect__option--disabled {
      background-color: #efefef;
      color: #777777;
    }

    .badge svg {
      cursor: pointer;

      &:hover {
        color: $color-danger;
      }
    }
  }
</style>
