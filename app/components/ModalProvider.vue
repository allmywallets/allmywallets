<template>
  <sweet-modal :title="`How to use ${provider}?`" ref="modalProvider">
    <a slot="box-action" class="button button-small" href="https://github.com/allmywallets/providers-docs" target="_blank">
      <fa-icon :icon="['fab', 'github']" />
      <translate>Edit on GitHub</translate>
    </a>
    <article v-html="content"></article>
    <button slot="button" class="button" @click="$refs.modalProvider.close()" v-translate>Close</button>
  </sweet-modal>
</template>

<script>
  import Showdown from 'showdown'
  import xss from 'xss'

  export default {
    name: 'modal-provider',
    props: {
      url: {
        type: String,
        required: true
      },
      provider: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        version: '',
        content: ''
      }
    },
    async mounted () {
      Showdown.extension('githubImage', () => {
        return [{
          type: 'lang',
          regex: /!\[(.*)\]\((.*)\)/,
          replace: (match, alt, src) => {
            return `<img src="${this.url}/${src}" alt="${alt}" />`
          }
        }]
      })
      const converter = new Showdown.Converter({ extensions: ['githubImage'] })

      converter.setFlavor('github')
      this.content = xss(converter.makeHtml(await fetch(this.url).then(res => res.text())))
    },
    methods: {
      open () {
        this.$refs.modalProvider.open()
      }
    }
  }
</script>
