const path = require("path")
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  configureWebpack: {
    plugins: [
      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, "./src/service-worker.js")
      }),
      new CopyWebpackPlugin([
        { from: 'node_modules/cryptocurrency-icons/32@2x/icon', to: 'public/icons' }
      ])
    ]
  }
}
