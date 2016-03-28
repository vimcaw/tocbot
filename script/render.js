var fs = require('fs');
var glob = require('glob');

var marked = require('marked');
var yaml = require('js-yaml');

var options = {
  src: '**/*.md',
  includeFilename: true,
  bodyProperty: 'body',
  compileMarkdown: true
};

// marked.setOptions({
//   renderer: new marked.Renderer(),
//   gfm: true,
//   tables: true,
//   breaks: true,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false,
//   highlight: function(code) {
//     return require('highlight.js').highlightAuto(code).value;
//   }
// });
//
// var SEPERATOR = '---';
//
// function parseFile(input) {
//   var output = {};
//   var splitData = input.data.split(SEPERATOR);
//   var rawBody = splitData[2];
//
//   try {
//     output = yaml.safeLoad(splitData[1]);
//   } catch (e) {
//     console.log(e); // eslint-disable-line
//   }
//
//   if (options.includeFilename) {
//     output.filename = input.filename;
//   }
//
//   output[options.bodyProperty] = rawBody;
//   if (options.compileMarkdown) {
//     var htmlBody = marked(rawBody);
//     output[options.bodyProperty] = htmlBody;
//   }
//
//   console.log(output);
//   return output;
//   // TODO: template stuff.
// }

function parseArguments(argv) {
  var args = argv.slice(2);
  var indexes = {};

  indexes.src = args.indexOf('--src');
  if (indexes.src !== -1) {
    options.src = args[indexes.src + 1];
  }

  var globOptions = {
    ignore: ['node_modules/**'] // ignore node_modules by default
  };

  glob(options.src, globOptions, function(error, files) {
    files.forEach(function(filename) {
      fs.readFile(filename, 'utf8', function(err, data) {
        // parseFile({
        //   data: data,
        //   filename: filename
        // });
      });
    });
  });
}

parseArguments(process.argv);

// var swig = require('swig');
// var markedSwig = require('swig-marked');
// var markdown = require('gulp-markdown-to-json');
// var rename = require('gulp-rename');
// var tap = require('gulp-tap');
// var util = require('gulp-util');
// var path = require('path');
// var browserSync = require('browser-sync');
// var handleErrors = require('../util/handleErrors');
// var config = require('../../config');
// var paths = config.paths;
//
// // Swig config.
// swig.setDefaults({
//   cache: false,
//   loader: swig.loaders.fs(paths.src),
//   locals: config
// });
//
// // Use markdown with swig (as a filter and a tag).
// markedSwig.useFilter(swig);
// markedSwig.useTag(swig);
//
// // Add swig-highlight for code highlighting.
// require('swig-highlight').apply(swig);
//
// // Gulp task
// gulp.task('docs-markdown', function () {
//   return gulp.src([
//       path.join('README.md'),
//       path.join(paths.docs, '**/*.md')
//       // path.join('*.md')
//     ])
//     .pipe(markdown({
//       gfm: true,
//       breaks: true,
//       highlight: function(code) {
//         return require('highlight.js').highlightAuto(code).value;
//       }
//     }))
//     // This produces a JSON object with the front-matter and the HTML for the
//     // markdown in a property called 'body'.
//     .pipe(tap(function(file, t) {
//       var json = JSON.parse(file.contents.toString());
//       var template = json.template || 'default';
//
//       var fileName = path.basename(file.path);
//       json.fileName = fileName.replace(/\.[^/.]+$/, ''); // Get the file name without the extension.
//
//       var tpl = swig.compileFile(paths.templates + template + '.html');
//       file.contents = new Buffer(tpl(json), 'utf8');
//     }))
//     .pipe(rename(function(file) {
//       if (file.basename === 'README') {
//         file.basename = 'index';
//       }
//       file.extname = '.html';
//     }))
//     .pipe(gulp.dest(paths.build))
//     .on('error', handleErrors)
//     .pipe(browserSync.reload({stream:true}));
// });
