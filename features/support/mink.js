const cucumber = require('cucumber')
const mink = require('cucumber-mink')
const { url } = require('../conf/default.conf.js').test_settings.default.globals
const { desiredCapabilities } = require('../conf/default.conf.js').test_settings.default

const parameters = {
  driver: {
    logLevel: 'silent',
    desiredCapabilities: desiredCapabilities,
    baseUrl: url
  }
}

const driver = new mink.Mink(parameters)

driver.hook(cucumber)
