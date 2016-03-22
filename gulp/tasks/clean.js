var gulp = require('gulp');
var del = require('del');
var paths = require('../../config').paths;

gulp.task('clean', function(cb) {
  return del([
    paths.dist,
    paths.build
  ], cb);
});
