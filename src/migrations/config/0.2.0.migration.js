module.exports = function(config) {
  config.profiles[0].application.modules = [
    {
      name: "statistics",
      repository: "/allmywallets/statistics-module",
      config: {}
    }
  ]
  config.profiles[0].wallets.forEach(wallet => {
    wallet.id = wallet.id.substr(0, 7)
  })
}
