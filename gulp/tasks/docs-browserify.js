var path = require('path');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var handleErrors = require('../util/handleErrors');
var paths = require('../../config').paths;

gulp.task('docs-browserify', function() {
  return browserify(paths.src + paths.js + 'index.js')
    .bundle()
    .pipe(source('tocbot.js'))
    .on('error', handleErrors)
    .pipe(gulp.dest(paths.dist)) // Remove this to prevent copying tocbot to /dist.
    .pipe(gulp.dest(path.join(paths.build, paths.js)))
    .pipe(browserSync.reload({stream:true}));
});
