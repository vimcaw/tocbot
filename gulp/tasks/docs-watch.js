var gulp = require('gulp');
var path = require('path');
var handleErrors = require('../util/handleErrors');
var paths = require('../../config').paths;

gulp.task('docs-watch', ['docs-browser-sync'], function() {
  // Watch task for css
  gulp.watch(path.join(paths.src + paths.scss, '**/*.scss'), ['docs-sass'])
    .on('error', handleErrors);

  // Watch task for js
  gulp.watch(path.join(paths.src + '**/*.js'), ['docs-browserify'])
    .on('error', handleErrors);
  // Watch task for test js
  gulp.watch(path.join(paths.test + '**/*.js'), ['docs-browserify-test'])
    .on('error', handleErrors);

  // Watch tasks for html
  gulp.watch(path.join(paths.src + '**/*.md'), ['docs-markdown'])
    .on('error', handleErrors);
  gulp.watch(path.join(paths.root + '*.md'), ['docs-markdown'])
    .on('error', handleErrors);
  gulp.watch(path.join(paths.src + '**/*.html'), ['docs-markdown'])
    .on('error', handleErrors);
});
