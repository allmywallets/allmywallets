<template>
  <div>
    <h2 v-translate>Contribute</h2>
    <p v-translate>
      AllMyWallets is being developed by a group of volunteers and the AllMyWallets community. If you like the app,
      don't hesitate to contribute too! There are many easy methods to get started.
    </p>
    <div class="contributions">
      <div class="contribution">
        <h3 v-translate>Bugs and new features</h3>
        <p v-translate>
          You can send bugs reports or contribute to the development in our GitHub repository. We are open to any
          contribution or feature request.
        </p>
        <p v-translate>
          If you want to start contributing to the code base of AllMyWallets, don't hesitate to ask for help or directions.
        </p>
        <p>
          <a class="button" href="https://github.com/allmywallets/allmywallets" target="_blank" rel="noopener">
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
          Do not hesitate to contribute by correcting or adding new translations.
        </p>
        <p>
          <a class="button" href="https://github.com/allmywallets/allmywallets/tree/master/app/translations" target="_blank" rel="noopener">
            <fa-icon icon="language" />
            <translate>Translate the application</translate>
          </a>
        </p>
      </div>
      <div class="contribution">
        <h3 v-translate>Contact</h3>
        <p>
          <translate>
            We don't respond to bug reports (except for responsible disclosures) nor feature requests.
            Please use our GitHub repository instead.
          </translate>
          <a class="button button-small" href="https://github.com/allmywallets/allmywallets/issues" target="_blank" rel="noopener">
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
    <h2 v-translate>Support</h2>
    <p v-translate>
      There are many different ways to support AllMyWallets. Don't hesitate to propose new ideas to promote AllMyWallets
      on our GitHub repository.
    </p>
    <div class="contributions">
      <div class="contribution">
        <h3 v-translate>Spread the word</h3>
        <p v-translate>
          Spreading the word about AllMyWallets is extremely beneficial to the app, because it offers more users and
          contributors to enhance translations, existing features and fix bugs.
        </p>
        <p>
          <translate>Do not hesitate to give a star to the AllMyWallets repository on Github.</translate>
          <a class="button button-small" href="https://github.com/allmywallets/allmywallets" target="_blank" rel="noopener">
            <fa-icon :icon="['fab', 'github']" />
            <translate>Star on GitHub</translate>
          </a>
        </p>
        <p v-translate>
          You can also share a link to AMW on social networks or Reddit, for instance.
        </p>
      </div>
      <div class="contribution contribution-double">
        <div class="contribution-column">
          <h3 v-translate>Donate</h3>
          <p v-translate>
            You can send us a tip if you like our work. This will help us paying for the servers and allow us spending
            more time on AMW development.
          </p>
          <p>
            <translate>You can also use Brave to donate a small amount of BAT each month to the project.</translate>
            <a class="button button-small" href="https://www.brave.com/download/" target="_blank" rel="noopener">
              <fa-icon icon="globe" />
              <translate>Download Brave browser</translate>
            </a>
          </p>
          <p v-translate>
            If you want to donate in another currency directly (to avoid paying too much exchange fees), don't hesitate to contact us.
          </p>
        </div>
        <div class="contribution-column">
          <ul>
            <li>Bitcoin <span class="badge badge-light" v-translate>Available soon...</span></li>
            <li><translate>Ethereum, ERC20 Tokens</translate> <span class="badge badge-light" v-translate>Available soon...</span></li>
            <li>Bitcoin Cash <span class="badge badge-light" v-translate>Available soon...</span></li>
            <li>Litecoin <span class="badge badge-light" v-translate>Available soon...</span></li>
            <li>ZCash <span class="badge badge-light" v-translate>Available soon...</span></li>
            <li>IOTA <span class="badge badge-light" v-translate>Available soon...</span></li>
            <li>RaiBlocks <span class="badge badge-light" v-translate>Available soon...</span></li>
            <li>
              <translate>Other</translate>
              <a class="button button-small" href="mailto:team@allmywallets.io">
                <fa-icon icon="envelope" />
                <translate>Contact us</translate>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
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
    margin: 0 -10px;

    .contribution {
      width: 100%;
      margin: 0 10px 10px;
      padding: 10px 20px;
      @include card();

      @media screen and(min-width: $breakpoint-large) {
        width: calc(33% - 20px);

        &.contribution-double {
          width: calc(66% - 20px);
        }
      }

      &.contribution-double {
        display: flex;

        .contribution-column {
          &:first-child {
            padding-right: 20px;
          }

          &:last-child {
            padding-left: 20px;
            border-left: 1px solid $color-section-notifications;
          }

          ul {
            list-style-type: none;
            padding: 0;
            line-height: 2rem;
          }

          @media screen and(min-width: $breakpoint-medium) {
            width: 50%;
          }
        }
      }
    }
  }
</style>
