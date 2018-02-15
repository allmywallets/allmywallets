const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

module.exports = env => ({
  entry: {
    'main': ['@babel/polyfill', path.resolve(__dirname, '../index.js')]
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    filename: './[name].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../'),
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!resolve-url-loader!sass-loader'
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff2?|eot|ico)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'assets/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'index.html', to: 'index.html' },
      { from: 'static', to: '' },
      { from: 'node_modules/cryptocurrency-icons/32@2x/icon', to: 'icons' }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        APP_VERSION: `"${env.APP_VERSION}"`
      }
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, '../src/worker/service-worker.js')
    })
  ]
})
