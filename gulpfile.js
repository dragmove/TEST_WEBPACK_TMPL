/*
 * node_modules
 */
var pkg = require('./package.json'),
  gulp = require('gulp'),
  rename = require("gulp-rename"),
  extend = require('extend'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  header = require('gulp-header'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackStream = require('webpack-stream'),
  runSequence = require('run-sequence');


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

function buildMergeJS(name, options) {
  var entry = {};
  entry[name] = ['./app/' + name + '.js'];

  var dist = 'build';

  if (options) {
    if (options.requireBabelPolyfill === true) entry[name].unshift('babel-polyfill');
    if (options.distPath) dist = options.distPath;
  }

  var config = extend({}, require('./webpack.config.js'), {
    devtool: 'eval-source-map',
    entry: entry,
    output: {
      filename: name + '.merge.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: false,
          warnings: false
        },
        sourceMap: true,
        mangle: false
      })
    ]
  });

  return gulp.src('')
    .pipe(webpackStream(config))
    .pipe(header(banner('dev')))
    .pipe(gulp.dest(dist));
};

function buildMinJs(name, options) {
  var entry = {};
  entry[name] = ['./app/' + name + '.js'];

  var dist = 'build';

  if (options) {
    if (options.requireBabelPolyfill === true) entry[name].unshift('babel-polyfill');
    if (options.distPath) dist = options.distPath;
  }

  var config = extend({}, require('./webpack.config.js'), {
    entry: entry,
    output: {
      filename: name + '.min.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: true,
          warnings: false
        },
        // make external sourcemap file
        sourceMap: true,
        mangle: true
      }),

      // http://webpack.github.io/docs/list-of-plugins.html#sourcemapdevtoolplugin
      new webpack.SourceMapDevToolPlugin({
        test: [dist + '/' + name + '.min.js'],
        filename: '[file].map',
        append: '#sourceMappingURL'
      })
    ]
  });

  return gulp.src('')
    .pipe(webpackStream(config))
    .pipe(header(banner('live')))
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
gulp.task('devMain', () => {
  buildMergeJS('main', {requireBabelPolyfill: true})
});
gulp.task('liveMain', () => {
  buildMinJs('main', {requireBabelPolyfill: true})
});

gulp.task('devSub', () => {
  buildMergeJS('sub', {requireBabelPolyfill: true})
});
gulp.task('liveSub', () => {
  buildMinJs('sub', {requireBabelPolyfill: true})
});