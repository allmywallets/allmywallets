<template>
  <div>
    <h2 v-translate>Contribute</h2>
    <p v-translate>
      AllMyWallets is being developed by a group of volunteers and the AllMyWallets community. If you like  the app,
      don't hesitate to contribute too! There are many easy methods to get started.
    </p>
    <div class="contributions">
      <div class="contribution">
        <h3 v-translate>Bugs</h3>
        <p v-translate>
          You can send bugs reports or contribute to the development in our GitHub repository. We are open to any
          contribution or feature request.
        </p>
        <p v-translate>
          If you want to start contributing to the code base of AllMyWallets, don't hesitate to ask for help or indications
          to successfully do your first contribution.
        </p>
        <p>
          <a class="button" href="https://github.com/allmywallets/allmywallets" target="_blank">
            <fa-icon :icon="['fab', 'github']" />
            <translate>Contribute on GitHub</translate>
          </a>
        </p>
      </div>
      <div class="contribution">
        <h3 v-translate>Translations</h3>
        <p v-translate="{ count: Object.keys(languages).length }">
          AllMyWallets can be translated and is currently available in %{count} different languages:
        </p>
        <p>
          <template v-for="language of languages">
            {{ language }}<template v-if="language !== languages[Object.keys(languages)[Object.keys(languages).length - 1]]">, </template>
          </template>.
        </p>
        <p v-translate>
          Don't hesitate to contribute by correcting or adding new translations.
        </p>
        <p>
          <a class="button" href="https://github.com/allmywallets/allmywallets/tree/master/app/translations" target="_blank" v-translate>
            <fa-icon icon="language" />
            Translate the application
          </a>
        </p>
      </div>
      <div class="contribution">
        <h3 v-translate>Contact</h3>
        <p>
          <translate>
            We don't respond to bug reports (except for responsible disclosures) nor feature requests. Please use our GitHub repository instead.
          </translate>
          <a class="button button-small" href="https://github.com/allmywallets/allmywallets/issues" target="_blank">
            <fa-icon :icon="['fab', 'github']" />
            <translate>See on GitHub</translate>
          </a>
        </p>
        <p v-translate>
          We will try to respond to your e-mail as soon as possible. It may take several days, though.
        </p>
        <p>
          <a class="button" href="mailto:team@allmywallets.io">
            <fa-icon icon="envelope" />
            <translate>Send us an e-mail</translate>
          </a>
        </p>
      </div>
    </div>
    <h2 v-translate>Donate</h2>
    <p v-translate>
      You can send us a tip if you like our work. This will help us paying for the servers and allow us spending more
      time on AMW development.
    </p>
    <p>Available soon...</p>
    <providers-credits />
  </div>
</template>

<script>
  import { getAvailableLanguages } from '../translator'
  import ProvidersCredits from './ProvidersCredits.vue'

  export default {
    name: 'page-contribute',
    components: {
      ProvidersCredits
    },
    computed: {
      languages () {
        return getAvailableLanguages()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .contributions {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px 10px;

    .contribution {
      width: 100%;
      margin: 0 10px;
      padding: 10px 20px;
      @include card();

      @media screen and(min-width: $breakpoint-large) {
        width: calc(33% - 20px);
      }
    }
  }
</style>
