const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')

module.exports = env => merge(base(env), {
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        APP_SERVER_URL: '"https://api.allmywallets.io"'
      }
    })
  ]
})
