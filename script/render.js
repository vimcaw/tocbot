var fs = require('fs');
var glob = require('glob');
var path = require('path');
var mkdirp = require('mkdirp');
require('babel-register'); // Is this still needed?

var marked = require('marked');
var yaml = require('js-yaml');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');

var util = require('./util.js');

var options = {
  src: 'build/content.json',
  includeFilename: true,
  bodyProperty: 'body',
  compileMarkdown: true,
  templatesDir: 'src/templates'
};

// Require config.
var config = require('./config.js');

// Get wrapper if config.useWrapper is true.
var wrapper = '';
if (config.useWrapper) {
  wrapper = fs.readFileSync(config.wrapperLocation).toString();
}

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
  var target = {};

  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function processJSON(string) {
  var json = JSON.parse(string);

  if (config.pathMap) {
    json = extend(json, config.pathMap[json.filename]);
  }
  // console.log(json.component)
  if (json.component) {
    // Get the Component and render the HTML to wrap it.
    var file = path.resolve(path.join('./', options.templatesDir, json.component + '.jsx'));
    var Component = require(file);
    var componentHTML = ReactDOMServer.renderToString(React.createElement(Component, json));
    var html = wrapper.split(config.wrapperInsertionPoint).join(componentHTML);

    // console.log(html)
    // Write Files
    var filePath = path.join(config.renderPath, json.path);
    util.writeFile(filePath, html);
  } else {
    return new Error ('No "component" property passed in for: ' + json.filename);
  }
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
