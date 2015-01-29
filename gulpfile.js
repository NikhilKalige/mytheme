var gulp = require("gulp");
var browser_sync = require("browser-sync");
var sass = require("gulp-ruby-sass");
var filter = require("gulp-filter");
var plumber = require('gulp-plumber');
var colors = require("colors");
var reload = browser_sync.reload;
var minify_css = require('gulp-minify-css');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var lazypipe = require('lazypipe');
var del = require("del");
var imagemin = require("imagemin");
//var optipng = require("imagemin-optipng");
var argv = require('yargs').argv;

var production = !!(argv.production);

var paths = {
    scss: "./scss/index.scss",
    scss_glob: "./scss/**/*.scss",
    production: "./pelican-theme",
    development: ".",
    css: "/static/css",
    js: "/statis/js"
}

/**
 * Plumber error handler
 */
var error_handler = function(err) {
    console.log('[SASS] '.bold.magenta + err.message.bold.red);
    this.emit('end');
};

/**
 * Css minify Pipe
 */
var css_minify_pipe = lazypipe()
    .pipe(minify_css)
    .pipe(rename, 'index.min.css')
    .pipe(gulp.dest, (paths.production + paths.css));


/**
 * Sass Task
 */
gulp.task("sass", function() {
    console.log('[sass]'.bold.magenta + ' Compiling Sass');
    return gulp.src(paths.scss)
        .pipe(plumber({
            errorHandler: error_handler
        }))
        .pipe(sass({
            //sourcemapPath: paths.css,
            style: "expanded",
            lineNumbers: true
        }))
        .pipe(gulp.dest(paths.development + paths.css))
        .pipe(filter("**/*.css"))
        .pipe(browser_sync.reload({stream: true}))
        .pipe(gulpif(production, css_minify_pipe()));
});

/**
 * Copy static files
 */
gulp.task("copy", function() {
    del([paths.production + "**/*"]);
    gulp.src([
        paths.development + "/static/fonts/**/*",
        paths.production + "/static/js"
        ],
        { base: 'static'}
    )
        .pipe(gulp.dest(paths.production + "/static"));

    // copy images
    gulp.src([paths.development + "/static/images/**/*.ico"])
        .pipe(gulp.dest(paths.production + "/static/images/"));

    // copy templates
    gulp.src([paths.development + "/templates/**/*"], {base: 'templates'})
        .pipe(gulp.dest(paths.production + "/templates"));
});

/**
 * Imagemin task
 */
gulp.task("image", function() {
    var image_task = new imagemin()
        .src(paths.development + "/static/images/**/*.png")
        .dest(paths.production + "/static/images/")
        .use(imagemin.optipng({optimizationLevel: 5}));

    image_task.run(function (err, files) {
        if (err)
            throw err;
    });
})

/**
 * Start server
 */
gulp.task("server", function() {
    browser_sync({
        server: {
            baseDir: "./",
            browser: "google-chrome",
            notify: false
        }
    });
});

gulp.task("default", ["server", "sass"], function() {
    /* Watch scss */
    gulp.watch([paths.scss_glob], ["sass"]);
    /* Watch html files */
    //gulp.watch(["*.html"], [reload]);
});

gulp.task("theme", ["copy", "sass"]);

