module.exports = {
  migrate (config) {
    for (const wallet of config.profiles[0].wallets) {
      if ('explorerSpecific' in wallet.parameters) {
        for (const key in wallet.parameters.explorerSpecific) {
          wallet.parameters[key] = wallet.parameters.explorerSpecific[key]
        }

        delete wallet.parameters.explorerSpecific
      }
    }

    config.application = {}
    config.application['version'] = '0.1.0'
    config.profiles[0].application = {}
    config.profiles[0].application['currencies'] = { 'primary': 'USD', 'secondary': 'BTC' }
  },
  next: '0.1.0'
}
