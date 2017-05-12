/*
 * node_modules
 */
var pkg = require('./package.json'),
  gulp = require('gulp'),
  extend = require('extend'),
  jshint = require('gulp-jshint'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackStream = require('webpack-stream');

/*
 * functions
 */
function banner(_net) {
  var date = new Date();
  return [
    '/*',
    '  ' + _net + ' Update : ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
    '*/',
    ''
  ].join('\n');
}

function isDefined(obj) {
  var flag = true;
  if (obj === null || typeof obj === 'undefined') return false;
  return flag;
}

function isBoolean(obj) {
  if (!isDefined(obj)) return false;
  return (obj.constructor === Boolean);
}

function buildMinJs(name, options) {
  var entry = {};
  entry[name] = ['./app/' + name + '.js'];

  var isRequireSourceMap = true,
    dist = 'build';

  if (options) {
    if (options.requireBabelPolyfill === true) entry[name].unshift('babel-polyfill');
    if (isBoolean(options.requireSourceMap)) isRequireSourceMap = options.requireSourceMap;
    if (options.distPath) dist = options.distPath;
  }

  var config = extend({}, require('./webpack.config.js'), {
    entry: entry,

    // https://webpack.js.org/configuration/devtool/
    devtool: (isRequireSourceMap === true) ? 'source-map' : false,

    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: true,
          warnings: false
        },
        sourceMap: true
      }),

      new webpack.BannerPlugin({
        banner: banner('live'),
        raw: true
      })
    ]
  });

  return gulp.src('')
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest(dist));
};

/*
 * gulp tasks
 */
// after run "gulp webpack-dev-server" in cmd window, connect "http://localhost:9001/webpack-dev-server/main.html"
gulp.task('webpack-dev-server', function () {
  var config = require('./webpack.config.js'),
    compiler = webpack(config);

  var server = new WebpackDevServer(compiler, config.devServer);
  server.listen(config.devServer.port, 'localhost', function (err) {
    if (err) console.error('[webpack-dev-server failed to start :', err);
  });
});

gulp.task('lint', function () {
  return gulp.src('app/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// build js
gulp.task('liveMain', () => {
  buildMinJs('main', {requireBabelPolyfill: true})
});

gulp.task('liveSub', () => {
  buildMinJs('sub', {requireBabelPolyfill: false})
});