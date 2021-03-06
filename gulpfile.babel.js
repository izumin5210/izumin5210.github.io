import gulp         from "gulp";
import loadPlugins  from "gulp-load-plugins";

import browserify   from "browserify";
import watchify     from "watchify";
import source       from "vinyl-source-stream";

import sass         from "gulp-ruby-sass";
import browserSync  from "browser-sync";
import path         from "path";
import del          from "del";
import runSequence  from "run-sequence";

import {appName}    from "./app/scripts/constants";


const $             = loadPlugins();
const reload        = browserSync.reload;


// configuration --------------------------------
const SRC_DIR       = path.join(__dirname, "./app");
const TEMP_DIR      = path.join(__dirname, "./.tmp");
const DEST_DIR      = path.join(__dirname, "./dist");

const SCRIPTS_DIR   = path.join(SRC_DIR, "scripts");
const TEMPLATES_DIR = path.join(SRC_DIR, "templates");
const STYLES_DIR    = path.join(SRC_DIR, "styles");
const IMAGES_DIR    = path.join(SRC_DIR, "images");

const SCRIPT_ENTRIES = [
  path.join(SCRIPTS_DIR, "app.js"),
  path.join(TEMP_DIR, "templates.js"),
  "./node_modules/angular-route/angular-route.js"
];

const STYLE_ENTRIES = [
  path.join(STYLES_DIR, "style.scss")
];

const OUTPUT_SCRIPT = "app.js";


// scripts --------------------------------
let getBundler = (opts) => {
  let browserifyOpts = {
    entries: SCRIPT_ENTRIES,
    debug: opts.debug,
    extensions: [".js"]
  };

  return browserify(browserifyOpts).transform("babelify");
}

let bundle = (opts) => {
  let bundler = getBundler(opts);

  let rebundle = () => {
    return bundler.bundle()
      .pipe(source(OUTPUT_SCRIPT))
      .pipe(gulp.dest(TEMP_DIR))
      .pipe($.streamify($.uglify()))
      .pipe($.streamify($.size({title: "scripts"})))
      .pipe(gulp.dest(DEST_DIR));
  };

  if (opts.watch) {
    bundler = watchify(bundler).on("update", rebundle);
  }

  return rebundle();
}

gulp.task("browserify", bundle.bind(null, { watch: false, debug: true }));
gulp.task("watchify", bundle.bind(null, { watch: true, debug: true }));
gulp.task("build:scripts", ["browserify"]);


// templates --------------------------------
const TEMPLATES_OPTIONS = {
  module:   appName,
  base:     TEMPLATES_DIR
};

gulp.task("build:templates", () => {
  return gulp.src(path.join(TEMPLATES_DIR, "**/*.html"))
    .pipe($.angularTemplatecache(TEMPLATES_OPTIONS))
    .pipe($.size({title: "templates.js"}))
    .pipe(gulp.dest(TEMP_DIR));
})


// html --------------------------------
gulp.task("build:html", () => {
  return gulp.src([path.join(SRC_DIR, "**/*.html"), `!${path.join(TEMPLATES_DIR, "**/*.html")}`])
    .pipe($.if("*.html", $.minifyHtml()))
    .pipe(gulp.dest(DEST_DIR))
    .pipe($.size({title: "html"}));
});


// styles --------------------------------
const SCSS_LINT_OPTIONS = {
  bundleExec: true,
  config: ".scsslint.yml"
};

const SASS_OPTIONS = {
  bundleExec: true,
  sourcemap: true,
  trace: true,
  loadPath: STYLES_DIR,
  require: "sass-globbing"
};

const AUTOPREFIXER_BROWSERS = [
  "ie >= 10",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10"
];

gulp.task("lint:scss", () => {
  return gulp.src(path.join(STYLES_DIR, "**/*.scss"))
    .pipe($.scssLint(SCSS_LINT_OPTIONS))
    .pipe($.scssLint.failReporter());
});

gulp.task("lint:css", () => {
  return gulp.src(path.join(DEST_DIR, "**/*.scss"))
    .pipe($.csslint())
    .pipe($.csslint.reporter())
    .pipe($.csslint.failReporter());
});

gulp.task("build:styles", ["lint:scss"], () => {
  return sass(STYLE_ENTRIES, SASS_OPTIONS)
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(TEMP_DIR))
    .pipe($.if("*.css", $.minifyCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(DEST_DIR))
    .pipe($.size({title: "styles"}));
});


// misc --------------------------------
gulp.task("build:images", () => {
  return gulp.src(path.join(IMAGES_DIR, "**/*"))
    .pipe(gulp.dest(path.join(DEST_DIR, "images")))
    .pipe($.size({title: "images"}));
});


// misc --------------------------------
const COPY_TARGET_FILES = [
  path.join(SRC_DIR, "*"),
  `!${path.join(SRC_DIR, "*.html")}`
];

gulp.task("build:copy", () => {
  return gulp.src(COPY_TARGET_FILES, {dot: true, nodir: true})
    .pipe(gulp.dest(DEST_DIR))
    .pipe($.size({title: "copy"}));
});


const CLEAN_TARGET_DIRS = [
  TEMP_DIR,
  path.join(DEST_DIR, "*"),
  `!${path.join(DEST_DIR, ".git")}`
];

gulp.task("clean", () => del(CLEAN_TARGET_DIRS, {dot: true}))


// browserSync --------------------------------
gulp.task("serve", ["watchify"], () => {
  browserSync({
    server: [SRC_DIR, TEMP_DIR]
  });

  gulp.watch([OUTPUT_SCRIPT], reload);
  gulp.watch([path.join(TEMPLATES_DIR, "**/*.html")], ['build:templates']);
  gulp.watch([path.join(SRC_DIR, "**/*.html"), `!${TEMPLATES_DIR}`], reload);
  gulp.watch([path.join(STYLES_DIR, "**/*.{scss,css}")], ["build:styles", reload]);
});


// build --------------------------------
gulp.task("build", ["clean"], (callback) => {
  runSequence(
    "build:templates",
    ["build:scripts", "build:styles", "build:html", "build:copy", "build:images"],
    callback
  );
});

const DEPLOY_OPTIONS = {
  branch: "master"
};

gulp.task("deploy", ["build"], () => {
  return gulp.src(path.join(DEST_DIR, "**/*"))
    .pipe($.ghPages(DEPLOY_OPTIONS));
});


// test --------------------------------
gulp.task("test", (callback) => {
  runSequence(
    "build:styles",
    "lint:css"
  )
});
