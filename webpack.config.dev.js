const path = require('path');
const webpack = require('webpack');
const FriendlyErrors = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    './js/polyfills/custom-polyfills.js',
    './js/polyfills/fetch.min.js',
    './js/index.js',
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'js'),
      'node_modules',
    ],
    extensions: ['.js', '.json'],
    unsafeCache: true,
  },
  performance: {
    hints: false,
  },
  devtool: false,
  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory
  target: 'web',
  stats: 'errors-only',
  devServer: {
    compress: true, // enable gzip compression
    inline: true,
    noInfo: true, // only errors & warns on hot reload
    overlay: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new FriendlyErrors(),
  ],
};
