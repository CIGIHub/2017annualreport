const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './js/polyfills/custom-polyfills.js',
    './js/polyfills/fetch.min.js',
    './js/polyfills/promise.min.js',
    './js/index.js',
  ], // string | object | array
  // Here the application starts executing
  // and webpack starts bundling

  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, 'assets'), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: 'bundle[hash].js', // string
    // the filename template for entry chunks

    publicPath: '/assets/', // string
    // the url to the output directory resolved relative to the HTML page

  },

  module: {
    // configuration regarding modules

    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },

  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)

    modules: [
      path.resolve(__dirname, 'js'),
      'node_modules',
    ],
    // directories where to look for modules

    extensions: ['.js', '.json'],
    unsafeCache: true,
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
    assetFilter: assetFilename => assetFilename.endsWith('.js'),
  },

  devtool: false,

  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory

  target: 'web',

  stats: {
    hash: true,
    version: false,
    timings: false,
    modules: false,
    assets: false,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      ecma: 8,
      parallel: true,
    }),
  ],
};
