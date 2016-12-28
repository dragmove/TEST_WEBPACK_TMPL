/*
 * node_modules
 */
//var sourcemaps = require('gulp-sourcemaps');
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

  if(options) {
    if(options.hasNoBabelPolyfill) {
      entry[name] = ['./app/' + name + '.js'];
    }
  } else {
    entry[name] = ['babel-polyfill', './app/' + name + '.js'];
  }

  var config = extend({}, require('./webpack.config.js'), {
    devtool: 'eval-source-map',
    entry: entry,
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

  var dist = (options && options.distPath) ? options.distPath : 'build';
  return gulp.src('')
    .pipe(webpackStream(config))
    .pipe(concat( name + '.merge.js'))
    .pipe(header( banner('dev') ))
    .pipe(gulp.dest( dist ));
};

function buildMinJs(name, options) {
  var entry = {};
  if(options) {
    if(options.hasNoBabelPolyfill) {
      entry[name] = ['./app/' + name + '.js'];
    }
  } else {
    entry[name] = ['babel-polyfill', './app/' + name + '.js'];
  }

  var config = extend({}, require('./webpack.config.js'), {
    entry: entry,
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: true,
          warnings: false
        },
        sourceMap: false,
        mangle: true
      })
    ]
  });

  var dist = (options && options.distPath) ? options.distPath : 'build';
  return gulp.src('')
    .pipe(webpackStream(config))
    .pipe(concat( name + '.min.js' ))
    .pipe(header( banner('live') ))
    .pipe(gulp.dest( dist ));
};


/*
 * gulp tasks
 */
// after run "gulp webpack-dev-server" in cmd window, connect "http://localhost:9001/webpack-dev-server/main.html"
gulp.task('webpack-dev-server', function() {
  var config = require('./webpack.config.js'),
    compiler  = webpack(config);

  var server = new WebpackDevServer( compiler , config.devServer );
  server.listen(config.devServer.port, 'localhost', function(err) {
    if(err) console.error('[webpack-dev-server failed to start :', err);
  });
});

gulp.task('lint', function() {
  return gulp.src('app/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// build js
gulp.task('devMain', () => { buildMergeJS('main', {hasNoBabelPolyfill: true}) });
gulp.task('liveMain', () => { buildMinJs('main', {hasNoBabelPolyfill: true}) });

gulp.task('devSub', () => { buildMergeJS('sub', {hasNoBabelPolyfill: true}) });
gulp.task('liveSub', () => { buildMinJs('sub', {hasNoBabelPolyfill: true}) });