const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    static: './dist',
    historyApiFallback: true,
    open: true
  },
});