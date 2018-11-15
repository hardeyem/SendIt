const gulp = require("gulp");
const watch = require("gulp-watch");
const babel = require("gulp-babel");
const eslint = require("gulp-eslint");
const log = require("fancy-log");

gulp.task("watch",  function(){
  return gulp.watch("src/**/*.js", gulp.series("build"));
});

gulp.task("build", function(done) {
  // Run ESLint
  gulp.src(["src/**/*.js"])
    .pipe(eslint())
    .pipe(eslint.format())
  	.on('end', () => log('Linting done'));

  // Project Source
  gulp.src("src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"))
    .on('end', () => log('source built'));

  //can add browser source if included in this project

  done();
});

gulp.task("default",  gulp.series("build", "watch"), function (done) {
  done();
});