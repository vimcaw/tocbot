var gulp = require('gulp');
var mochatron = require('mochatron');
var paths = require('../../config').paths;

gulp.task('test', function() {
  mochatron({
    url: 'http://localhost:4100/test/test.html',
    silent: true,
    window: false
  });
});
