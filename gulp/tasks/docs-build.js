var gulp = require('gulp');

gulp.task('docs-build', [
  'docs-markdown',
  'docs-copy-files',
  'docs-sass',
  'docs-browserify'
]);
