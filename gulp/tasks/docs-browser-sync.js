var gulp = require('gulp');
var browserSync = require('browser-sync');
var handleErrors = require('../util/handleErrors');
var paths = require('../../config').paths;

gulp.task('docs-browser-sync', function() {
  browserSync({
    reloadDelay: 300,
    notify: {
      styles: ['position:fixed;top:5px;right:5px;width:10px;height:10px;background:#c82144;border-radius:50%;overflow:hidden;color:#c82144;z-index:99999']
    },
    port: 4100,
    server: {
      baseDir: paths.build,
    }
  });
});
