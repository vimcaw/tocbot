var fs = require('fs');
var glob = require('glob');
var path = require('path');
require('babel-register');

var marked = require('marked');
var yaml = require('js-yaml');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');

var options = {
  src: 'build/content.json',
  includeFilename: true,
  bodyProperty: 'body',
  compileMarkdown: true,
  templatesDir: 'src/templates'
};

// Require pathMap Object.
var pathMap = require('./pathMap.js');

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

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
  var target = {}

  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i]
    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

function processJSON(string) {
  var json = JSON.parse(string);

  if (pathMap) {
    json = extend(json, pathMap[json.filename]);
  }
  console.log(json.component)
  if (json.component) {
    var file = path.resolve(path.join('./', options.templatesDir, json.component + '.jsx'));
    var Component = require(file);
    var html = ReactDOMServer.renderToString(React.createElement(Component, json));
    console.log(html);
  } else {
    return new Error ('No "component" property passed in for: ' + json.filename);
  }

  // console.log(json);
  // for (var key in json) {
  //   if (pathMap) {
  //     json[key] = extend(json[key], pathMap[key]);
  //   }
  //
  //   console.log(key, json[key])
  // }

}


function parseArguments(argv) {
  var args = argv.slice(2);
  var indexes = {};

  // Get from stdin.
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      processJSON(chunk);
    }
  });
  process.stdin.on('end', function() {
    // process.stdout.write('end');
  });

  // Parse options.
  indexes.src = args.indexOf('--src');
  if (indexes.src !== -1) {
    options.src = args[indexes.src + 1];
  }

  var globOptions = {
    ignore: ['node_modules/**'] // ignore node_modules by default
  };


  // glob(options.src, globOptions, function(error, files) {
  //   files.forEach(function(filename) {
  //     fs.readFile(filename, 'utf8', function(err, data) {
  //       // parseFile({
  //       //   data: data,
  //       //   filename: filename
  //       // });
  //     });
  //   });
  // });
}

parseArguments(process.argv);
