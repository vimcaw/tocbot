var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var handleErrors = require('../util/handleErrors');
var paths = require('../../config').paths;

gulp.task('docs-sass', function() {
  return gulp.src(path.join(paths.src + paths.scss, '*.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: [
				'./node_modules/',
        require('optimizely-oui').includePath,
			]
    }))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(paths.build, paths.css)))
    .pipe(browserSync.reload({ stream: true }));
});
