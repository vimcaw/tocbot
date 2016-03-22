var path = require('path');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var handleErrors = require('../util/handleErrors');
var paths = require('../../config').paths;

gulp.task('docs-browserify-test', function() {
  return browserify(path.join(paths.test, 'test.js'))
    .bundle()
    .pipe(source('test.js'))
    .on('error', handleErrors)
    .pipe(gulp.dest(path.join(paths.build, paths.test)))
    .pipe(browserSync.reload({stream:true}));
});
