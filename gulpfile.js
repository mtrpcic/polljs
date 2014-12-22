"use strict";

var path = require("path"),
    gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    replace = require("gulp-replace"),
    runSequence = require("run-sequence"),
    pkg = require("./package.json");

var src = "./src",
    dest = __dirname,
    paths = {
        src: {
            scripts: [
                path.join(src, "*.js")
            ]
        },
        dest: {
            scripts: [
                path.join(dest, "*.js")
            ]
        }
    };

gulp.task("lint", function() {
    var scripts = paths.src.scripts.concat(["gulpfile.js"]);

    return gulp.src(scripts)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("compress", function() {
    var scripts = paths.dest.scripts.concat(["!gulpfile.js", "!index.js", "!*.min.js"]);

    return gulp.src(scripts)
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest(dest));
});

gulp.task("bundle", function() {
    return gulp.src(paths.src.scripts)
        .pipe(replace("@@VERSION", pkg.version))
        .pipe(gulp.dest(dest));
});

gulp.task("build", [], function(callback) {
    runSequence(["lint", "bundle"], "compress", callback);
});

gulp.task("default", function() {
    runSequence("build");
});
