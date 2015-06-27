gulp          = require('gulp')
$             = require('gulp-load-plugins')()

sass          = require('gulp-ruby-sass')
browserSync   = require('browser-sync')
reload        = browserSync.reload


#### configuration --------------------------------
config =
  entries:
    css: './app/styles/style.scss'
  src: './app'
  tmp: './.tmp'
  dest: './dist'


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
gulp.task('serve', ->
  browserSync(
    server: [config.src, config.tmp]
  )

  gulp.watch(["#{config.src}/**/*.html"], reload)
  gulp.watch(["#{config.src}/**/*.{scss,css}"], ['styles', reload])
)


#### build --------------------------------
gulp.task('build', ['styles', 'html'])
