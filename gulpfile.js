var gulp = require("gulp");
var browser_sync = require("browser-sync");
var sass = require("gulp-ruby-sass");
var filter = require("gulp-filter");
var plumber = require('gulp-plumber');
var colors = require("colors");
var reload = browser_sync.reload;

var paths = {
    scss: "./scss/**/*.scss",
    css: "./static/css"
}

/**
 * Plumber error handler
 */
var error_handler = function(err) {
    console.log('[SASS] '.bold.magenta + err.message.bold.red);
    this.emit('end');
};

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
            sourcemapPath: paths.css,
            style: "expanded",
            lineNumbers: true
        }))
        .pipe(gulp.dest(paths.css))
        .pipe(filter("**/*.css"))
        .pipe(browser_sync.reload({stream: true}));
});

/**
 * Start server
 */
gulp.task("server", function() {
    browser_sync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("default", ["server", "sass"], function() {
    /* Watch scss */
    gulp.watch([paths.scss], ["sass"]);
    /* Watch html files */
    gulp.watch(["*.html"], [reload]);
});



