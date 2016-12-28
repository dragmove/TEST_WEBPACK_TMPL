var webpack = require('webpack'),
  path = require('path');

module.exports = {
  // https://webpack.github.io/docs/build-performance.html#sourcemaps
  devtool: 'source-map',

  devServer: {
    contentBase: './build/',
    colors: true,
    noInfo: true, //  --no-info option
    // host: '',
    port: 9001,
    hot: true,
    inline: true
  },

  context: __dirname,

  entry: {
    main: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/main.js'],
    sub: [/*'webpack/hot/dev-server',*/ 'babel-polyfill', './app/sub.js']
  },

  output: {
    path: __dirname + '/build',
    filename: "[name].js"
  },

  module: {
    loaders: [
      {test: /\.css$/, loader: "style!css"},
      {test: /\.jsx?$/, loaders: ['babel'], exclude: /(node_modules|bower_components)/}
    ]
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: false,
        warnings: false
      },
      sourceMap: false,
      mangle: false
    })
  ],

  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extension: ['', '.js', '.json', '.coffee']
  }
};