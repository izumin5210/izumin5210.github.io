gulp          = require('gulp')
$             = require('gulp-load-plugins')()

browserify    = require('browserify')
watchify      = require('watchify')
source        = require('vinyl-source-stream')

sass          = require('gulp-ruby-sass')
browserSync   = require('browser-sync')
reload        = browserSync.reload


#### configuration --------------------------------
config =
  entries:
    css: './app/styles/style.scss'
    js: './app/scripts/app.js'
  output:
    js: 'app.js'
  src: './app'
  tmp: './.tmp'
  dest: './dist'


#### scripts --------------------------------
getBundler = (opts) ->
  browserifyOpts =
    entries: config.entries.js
    debug: opts.debug
    extensions: ['.js']

  browserify(browserifyOpts).transform('babelify')


bundle = (opts) ->
  bundler = getBundler(opts)

  rebundle = ->
    bundler.bundle()
      .pipe(source(config.output.js))
      .pipe(gulp.dest(config.tmp))
      .pipe($.streamify($.uglify()))
      .pipe($.streamify($.size(title: 'scripts')))
      .pipe(gulp.dest(config.dest))

  bundler = watchify(bundler).on('update', rebundle) if opts.watch
  rebundle()


gulp.task('browserify', bundle.bind(null, { watch: false, debug: true }))
gulp.task('watchify', bundle.bind(null, { watch: true, debug: true }))
gulp.task('scripts', ['browserify'])



#### html --------------------------------
gulp.task('html', ->
  gulp.src("#{config.src}/**/*.html")
    .pipe($.if('*.html', $.minifyHtml()))
    .pipe(gulp.dest(config.dest))
    .pipe($.size(title: 'html'))
)


#### styles --------------------------------
SASS_OPTIONS =
  bundleExec: true
  sourcemap: true

AUTOPREFIXER_BROWSERS = [
  'ie >= 10'
  'ie_mob >= 10'
  'ff >= 30'
  'chrome >= 34'
  'safari >= 7'
  'opera >= 23'
  'ios >= 7'
  'android >= 4.4'
  'bb >= 10'
]

gulp.task('styles', ->
  sass(config.entries.css, SASS_OPTIONS)
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(config.tmp))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.dest))
    .pipe($.size(title: 'styles'))
)


#### browserSync --------------------------------
gulp.task('serve', ['html', 'styles', 'watchify'], ->
  browserSync(
    server: [config.src, config.tmp]
  )

  gulp.watch(["#{config.tmp}/**/*.js"], reload)
  gulp.watch(["#{config.src}/**/*.html"], reload)
  gulp.watch(["#{config.src}/**/*.{scss,css}"], ['styles', reload])
)


#### build --------------------------------
gulp.task('build', ['scripts', 'styles', 'html'])
