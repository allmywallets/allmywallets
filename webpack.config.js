let webpack = require('webpack')
let path = require('path')

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
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'app/main.js')
  ],
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
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
      { test: /\.(png|jpe?g|gif|svg|ttf|woff2?|eot|ico)(\?.*)?$/, loader: 'url-loader', query: { limit: 10000, name: 'assets/[name].[ext]'}}
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
    })
  ]
}
