const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

exports.default = {
  context: path.resolve(__dirname, '../'),
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'observer.js',
    library: 'V',
    libraryTarget: 'var',
    umdNamedDefine: true
  },
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    compress: true,
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: /src/,
      loader: "babel-loader",
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
}