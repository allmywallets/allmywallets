const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')

module.exports = env => merge(base(env), {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: false,
    port: 8080
  },
  devtool: 'source-map',
  entry: {
    'webpack': 'webpack-dev-server/client?http://localhost:8080'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        APP_SERVER_URL: '"http://localhost:3030"',
        APP_VERSION: `"${env.APP_VERSION}"`
      }
    })
  ]
})
