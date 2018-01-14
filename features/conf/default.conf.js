const nightwatchCucumber = require('nightwatch-cucumber')
const chromedriverPath = require('chromedriver').path
const seleniumServerPath = require('selenium-server').path

nightwatchCucumber({
  cucumberArgs: [
    '--require', 'features/support/mink.js',
    'features'
  ]
})

module.exports = {
  output_folder: 'features/reports',
  selenium: {
    start_process: true,
    server_path: seleniumServerPath,
    cli_args: {
      'webdriver.chrome.driver': chromedriverPath
    }
  },
  test_settings: {
    default: {
      globals: {
        url: 'http://localhost:1337'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: [
            '--headless'
          ]
        }
      }
    }
  }
}
