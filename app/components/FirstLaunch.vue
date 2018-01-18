<template>
  <article>
    <h2>{{ $t('home.first_launch.title') }}</h2>
    <p class="intro">
      {{ $t('home.first_launch.introduction') }}<br />
      <router-link :to="{ name: 'home-add-wallet' }" class="button">{{ $t('home.first_launch.add_first_wallet') }}</router-link>
      <router-link :to="{ name: 'settings' }" class="button">{{ $t('actions.import_configuration') }}</router-link>
    </p>
    <ul class="features">
      <li class="feature">
        <fa-icon icon="money-bill-alt" /><br />
        <strong>{{ $t('home.first_launch.features.aggregates.title') }}</strong><br />
        <span class="more">{{ $t('home.first_launch.features.aggregates.description') }}</span>
      </li>
      <li class="feature">
        <fa-icon icon="lock" /><br />
        <strong>{{ $t('home.first_launch.features.safe.title') }}</strong><br />
        <span class="more">{{ $t('home.first_launch.features.safe.description') }}</span>
      </li>
      <li class="feature">
        <fa-icon icon="bell" /><br />
        <strong>{{ $t('home.first_launch.features.notifications.title') }}</strong>
        <span class="more">{{ $t('home.first_launch.features.notifications.description') }}</span>
      </li>
      <li class="feature">
        <fa-icon icon="key" /><br />
        <strong>{{ $t('home.first_launch.features.decentralized.title') }}</strong>
        <span class="more">{{ $t('home.first_launch.features.decentralized.description') }}</span>
      </li>
    </ul>
    <p class="intro">
      <router-link :to="{ name: 'home-add-wallet' }" class="button">{{ $t('home.first_launch.add_first_wallet') }}</router-link><br />
      {{ $t('home.first_launch.requirements') }}
    </p>
    <hr />
    <template v-if="missingCapabilities">
      <system-check />
      <hr />
    </template>
    <providers-credits />
  </article>
</template>

<script>
  import ProvidersCredits from './ProvidersCredits'
  import SystemCheck from './SystemCheck'
  import { missingCapabilities } from '../manager/system-manager'

  export default {
    components: {
      SystemCheck,
      ProvidersCredits
    },
    name: 'first-launch',
    data () {
      return {
        missingCapabilities: false
      }
    },
    mounted () {
      this.missingCapabilities = missingCapabilities()
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  article {
    text-align: center;
    margin: 0 auto;
    padding: 20px 0;
    max-width: 990px;

    .intro {
      display: block;
      max-width: 600px;
      margin: 0 auto;

      .button {
        margin: 20px 0;
      }
    }

    .features {
      margin: 20px 0;
      padding: 0;
      display: flex;
      flex-flow: wrap;
      text-align: center;

      .feature {
        flex-grow: 1;
        flex-basis: 0;
        list-style-type: none;
        padding: 10px 20px;

        @media screen and (min-width: $breakpoint-medium) {
          &:not(:last-child) {
            border-right: 1px solid $color-section-notifications;
          }
        }

        .more {
          margin-top: 10px;
          display: inline-block;
          text-align: left;
        }

        svg {
          color: $color-primary;
          font-size: 3rem;
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
