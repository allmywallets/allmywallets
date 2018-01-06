const { defineSupportCode } = require('cucumber')
const Mink = require('cucumber-mink')
const { url } = require('../conf/default.conf.js').test_settings.default.globals
const { desiredCapabilities } = require('../conf/default.conf.js').test_settings.default

const parameters = {
  driver: {
    logLevel: 'silent',
    desiredCapabilities: desiredCapabilities,
    baseUrl: url
  }
}

defineSupportCode((cucumber) => {
  Mink.configure(parameters)
  Mink.init(cucumber)
})
