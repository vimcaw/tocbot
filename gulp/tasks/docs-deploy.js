var path = require('path');
var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var paths = require('../../config').paths;

gulp.task('docs-deploy', function() {
  return gulp.src((path.join(paths.build, '**/*')))
    .pipe(ghPages());
});
