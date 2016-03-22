var gulp = require('gulp');

gulp.task('docs', [
  'docs-markdown',
  'docs-copy-files',
  'docs-sass',
  'docs-browserify',
  'docs-browser-sync',
  'docs-watch',
]);
