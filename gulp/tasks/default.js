var gulp = require('gulp');

gulp.task('default', [
  'docs-markdown',
  'docs-copy-files',
  'docs-sass',
  'docs-browserify',
  'docs-browserify-test', // temp
  'docs-browser-sync',
  'docs-watch',
]);
