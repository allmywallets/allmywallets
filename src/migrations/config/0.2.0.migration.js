module.exports = function (config) {
  config.profiles[0].application.modules = [
    {
      name: 'statistics',
      repository: '/allmywallets/statistics-module',
      config: {}
    }
  ]
}
