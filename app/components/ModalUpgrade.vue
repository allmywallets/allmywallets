<template>
  <sweet-modal :title="`Upgraded to version ${version}!`" ref="modalUpgrade" @close="closeModal">
    <a slot="box-action" class="button button-small" href="https://github.com/allmywallets/allmywallets/releases" target="_blank" rel="noopener">
      <fa-icon :icon="['fab', 'github']" />
      <translate>See on GitHub</translate>
    </a>
    <article v-html="content"></article>
    <button slot="button" class="button" @click="closeModal" v-translate>Close</button>
  </sweet-modal>
</template>

<script>
  import Showdown from 'showdown'
  import Configurator from '../configurator'
  import xss from 'xss'

  export default {
    name: 'modal-upgrade',
    data () {
      return {
        version: '',
        content: ''
      }
    },
    async mounted () {
      const converter = new Showdown.Converter()
      const version = await Configurator.getVersion()

      this.version = version.current

      converter.setFlavor('github')
      this.content = xss(converter.makeHtml(version.releaseNotes))

      this.$refs.modalUpgrade.open()
    },
    methods: {
      closeModal () {
        this.$router.push('/')
      }
    }
  }
</script>
