const webpack = require('webpack')
const path = require('path')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = env => ({
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
    'webpack': 'webpack-dev-server/client?http://localhost:8080',
    'main': ['@babel/polyfill', path.resolve(__dirname, '../index.js')]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: './[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../'),
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!resolve-url-loader!sass-loader?sourceMap'
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
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: path.join(__dirname, 'src'),
        output: {
          path: path.join(__dirname, 'www')
        }
      }
    }),
    new CopyWebpackPlugin([
      { from: 'index.html', to: 'index.html' },
      { from: 'static', to: '' },
      { from: 'node_modules/cryptocurrency-icons/32@2x/icon', to: 'icons' }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        APP_SERVER_URL: '"http://localhost:3030"',
        APP_VERSION: `"${env.APP_VERSION}"`
      }
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, '../src/worker/service-worker.js')
    })
  ]
})
