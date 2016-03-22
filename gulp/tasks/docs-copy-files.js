var gulp = require('gulp');
var changed = require('gulp-changed');
var path = require('path');
var handleErrors = require('../util/handleErrors');
var paths = require('../../config').paths;

gulp.task('docs-copy-files', function() {
  return gulp.src([
      path.join(paths.src + paths.files, '**/*')
    ])
    .pipe(changed(paths.build))
    .on('error', handleErrors)
    .pipe(gulp.dest(paths.build));
});
