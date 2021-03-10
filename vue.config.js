const path = require("path")
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin")

module.exports = {
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "public/sw.js"
    }
  },
  configureWebpack: {
    plugins: [
      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, "./src/service-worker.js")
      })
    ]
  }
}
