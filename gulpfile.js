var gulp = require("gulp");
var browser_sync = require("browser-sync");
var sass = require("gulp-sass");
var filter = require("gulp-filter");
var reload = browser_sync.reload;

var paths = {
    scss: "./scss/**/*.scss",
    css: "./static/css"
}

/**
 * Sass Task
 */
gulp.task("sass", function() {
    return gulp.src(paths.scss)
        .pipe(sass({sourcemap: true}))
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



