const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

module.exports = {
  entry: {
    'main': ['babel-polyfill', path.resolve(__dirname, 'app/main.js')]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: './[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'app'), path.resolve(__dirname, 'explorerLibName')],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2']
        }
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
      { test: /\.(png|jpe?g|gif|svg|ttf|woff2?|eot|ico)(\?.*)?$/, loader: 'url-loader', query: { limit: 10000, name: 'assets/[name].[ext]' } }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      vue: 'vue/dist/vue.min'
    }
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        VERSION: '"' + Math.floor(Math.random() * 1e20) + '"',
        SERVER_URL: '"https://api.allmywallets.io"'
      }
    }),
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' },
      { from: './app/static', to: 'static' }
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: path.join(__dirname, 'src'),
        output: {
          path: path.join(__dirname, 'www')
        }
      }
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'app/service-worker.js')
    })
  ],
  node: {
    fs: 'empty'
  }
}
