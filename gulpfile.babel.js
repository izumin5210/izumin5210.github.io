import gulp             from "gulp";
import gulpLoadPlugins  from "gulp-load-plugins";

import browserify   from "browserify";
import watchify     from "watchify";
import source       from "vinyl-source-stream";
import buffer       from "vinyl-buffer";
import del          from "del";
import runSequence  from "run-sequence";
import browserSync  from "browser-sync";
import path         from "path";

import eslintify  from "eslintify";
import envify     from "envify";
import babelify   from "babelify";
import licensify  from "licensify";
import uglifyify  from "uglifyify";

import postcssApply     from "postcss-apply";
import postcssImport    from "postcss-import";
import postcssNesting   from "postcss-nesting";
import postcssFlexbugsFixes     from "postcss-flexbugs-fixes";
import postcssCustomProperties  from "postcss-custom-properties";
import autoprefixer     from "autoprefixer";
import postcssCsso      from "postcss-csso";
import postcssReporter  from "postcss-reporter";
import stylelint        from "stylelint";


const $       = gulpLoadPlugins();
const reload  = browserSync.reload;
const debug   = process.env.NODE_ENV != "production";

const config = {
  src: path.join(__dirname, "./src"),
  dest: path.join(__dirname, "./dist")
}

// scripts --------------------------------

const getBundler = opts => {
  const browserifyOpts = {
    entries: [path.join(config.src, "scripts/index.js")],
    debug: opts.debug,
    extensions: [".js", ".jsx"]
  };

  return browserify(browserifyOpts)
    .transform({ continuous: true }, eslintify)
    .transform(envify)
    .transform(babelify)
    .plugin(licensify)
    .transform({ global: true }, uglifyify);
};

const bundle = (opts) => {
  let bundler = getBundler(opts);

  const rebundle = () => bundler.bundle()
      .pipe(source("bundle.js"))
      .pipe($.plumber())
      .pipe(buffer())
      .pipe($.size({title: "scripts"}))
      .pipe(gulp.dest(config.dest))
      .on("end", reload);

  if (opts.watch) {
    bundler = watchify(bundler).on("update", rebundle);
  }

  return rebundle();
};

gulp.task("browserify", bundle.bind(null, { watch: false, debug: debug }));
gulp.task("watchify", bundle.bind(null, { watch: true, debug: debug }));
gulp.task("build:scripts", ["browserify"]);

// styles --------------------------------

gulp.task("build:styles", () => {
  const processors = [
    postcssImport({
      plugins: [stylelint]
    }),
    postcssCustomProperties,
    postcssApply,
    postcssNesting,
    postcssFlexbugsFixes,
    autoprefixer,
    postcssCsso,
    postcssReporter
  ];
  return gulp.src(path.join(config.src, "styles/app.css"))
    .pipe($.if(debug, $.sourcemaps.init()))
    .pipe($.plumber())
    .pipe($.postcss(processors))
    .pipe($.if(debug, $.sourcemaps.write(".")))
    .pipe(gulp.dest(config.dest))
    .pipe($.size({ title: "styles" }));
});

// misc --------------------------------

gulp.task("build:html", () =>
  gulp.src(path.join(config.src, "**/*.html"))
    .pipe($.if("*.html", $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    .pipe($.if("*.html", $.size({ title: "html", showFiles: true })))
    .pipe(gulp.dest(config.dest))
);

gulp.task("build:images", () =>
  gulp.src(path.join(config.src, "images/**/*"))
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe($.size({ title: "images" }))
    .pipe(gulp.dest(path.join(config.dest, "images")))
);

gulp.task("serve", ["build", "watchify"], () => {
  browserSync({
    notify: false,
    open: false,
    server: ["dist"],
    port: process.env.PORT || 3000
  });

  gulp.watch([path.join(config.src, "/**/*.html")], ["build:html", reload]);
  gulp.watch([path.join(config.src, "/styles/**/*.css")], ["build:styles", reload]);
  gulp.watch([path.join(config.src, "/images/**/*")], ["build:images", reload]);
});

gulp.task('clean', () => del([config.dest, `!${path.join(config.dest, ".git")}`], { dot: true }));
gulp.task("build", ["clean"], cb =>
    runSequence(["build:scripts", "build:styles", "build:html", "build:images"], cb)
);

