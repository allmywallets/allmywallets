module.exports = function (config) {
  for (const wallet of config.profiles[0].wallets) {
    if ('explorerSpecific' in wallet.parameters) {
      for (const key in wallet.parameters.explorerSpecific) {
        wallet.parameters[key] = wallet.parameters.explorerSpecific[key]
      }

      delete wallet.parameters.explorerSpecific
    }
  }

  config.application = {}
  config.profiles[0].application = {}
  config.profiles[0].application['currencies'] = { 'primary': 'USD', 'secondary': 'BTC' }
}
