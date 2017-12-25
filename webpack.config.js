const webpack = require('webpack')
const path = require('path')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: './app',
    port: 8080
  },
  devtool: 'source-map',
  entry: {
    'webpack': 'webpack-dev-server/client?http://localhost:8080',
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
        include: path.resolve(__dirname, 'app'),
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
            scss: 'vue-style-loader!css-loader!resolve-url-loader!sass-loader?sourceMap'
          }
        }
      },
      { test: /\.(png|jpe?g|gif|svg|ttf|woff2?|eot|ico)(\?.*)?$/, loader: 'url-loader', query: { limit: 10000, name: 'assets/[name].[ext]' } }
    ]
  },
  resolve: {
    extensions: ['.js'],
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
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'app/service-worker.js')
    })
  ]
}
