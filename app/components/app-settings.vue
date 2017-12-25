<template>
  <div>
    <h2>Application settings</h2>
    <h3>Customization</h3>
    <p>TBD</p>
    <h3>Export configuration</h3>
    <p>
      You can export your configuration to another device by scanning the above QRCode or accessing the url from the
      targeted device. This will replace its configuration with the current configuration of All My Wallets; it will
      export your wallets and customization settings.
    </p>
    <canvas ref="qrcode"></canvas>
    <config-expert></config-expert>
    <h2>Danger zone</h2>
    <a href="#" @click.prevent="forceUpdate">Force app update</a>
  </div>
</template>

<script>
  import ConfigExpert from './config-expert.vue'
  import QRCode from 'qrcode'

  export default {
    name: 'app-settings',
    components: {
      ConfigExpert
    },
    methods: {
      forceUpdate () {
        this.$serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister()
          }
        })
        location.reload()
      }
    },
    mounted () {
      QRCode.toCanvas(this.$refs.qrcode, 'hello world!', () => {})
    }
  }
</script>
