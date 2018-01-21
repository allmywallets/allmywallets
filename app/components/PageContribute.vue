<template>
  <div>
    <h2 v-translate>Contribute</h2>
    <h3 v-translate>Bugs</h3>
    <p>
      You can send bugs reports or contribute to the development in our
      <a href="https://github.com/allmywallets/allmywallets" target="_blank">GitHub</a> repository.
    </p>
    <h3 v-translate>Translations</h3>
    <p v-translate>AllMyWallets is currently available in the following languages:</p>
    <ul>
      <li v-for="language of languages">{{ language }}</li>
    </ul>
    <p>
      <a href="https://github.com/allmywallets/allmywallets/tree/master/app/translations" v-translate>Contribute to translate the app!</a>
    </p>
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
