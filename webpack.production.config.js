let webpack = require('webpack')
let path = require('path')
let CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: 'cheap-source-map',
  entry: {
    'main': ['babel-polyfill', path.resolve(__dirname, 'app/main.js')],
    'service-worker': path.resolve(__dirname, 'app/service-worker.js')
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
          presets: ['es2015']
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
      vue: 'vue/dist/vue.min'
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        VERSION: '"' + Math.floor(Math.random() * 1e20) + '"'
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
    })
  ]
}
