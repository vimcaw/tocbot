/**
 * tocbot
 * tocbot is similar to tocify (http://gregfranko.com/jquery.tocify.js/) (except its native w/ no need for jquery)
 * This creates a toble of contents based on HTML headings which allows users to easily jump to different sections.
 *
 * @author Tim Scanlin
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory(root));
	} else if (typeof exports === 'object') {
    module.exports = factory(root);
	} else {
    root.tocbot = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function(root) {

  'use strict';

  // Default options.
  var defaultOptions = require('./default-options.js');
  // Object to store current options.
  var options = {};
  // Object for public APIs.
  var tocbot = {};

  var BuildHtml = require('./build-html.js');
  var ParseContent = require('./parse-content.js');
  // Keep these variables at top scope once options are passed in.
  var buildHtml;
  var parseContent;

  var doc = root.document;
  var body = document.body;
  var supports = !!root.document.querySelector && !!root.addEventListener; // Feature test
  var headingsArray;

  // From: https://github.com/Raynos/xtend
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

  function updateTocListener(headingsArray) {
    return function updateToc() {
      return buildHtml.updateToc(headingsArray);
    }
  }

  /**
	 * Destroy tocbot.
	 */
  tocbot.destroy = function() {
		// Remove event listeners
    document.removeEventListener('scroll', updateTocListener(headingsArray));
    document.removeEventListener('resize', updateTocListener(headingsArray));
    if (buildHtml) {
      document.removeEventListener('click', buildHtml.disableTocAnimation);
    }

    // Destroy smoothScroll if it exists.
    if (options.smoothScroll) {
      options.smoothScroll.destroy();
    }
  };

  /**
	 * Initialize tocbot.
	 * @param {object} customOptions
	 */
  tocbot.init = function(customOptions) {
    // feature test
    if (!supports) {
      return;
    }

    // Merge defaults with user options.
    // Set to options variable at the top.
    options = extend(defaultOptions, customOptions || {});
    this.options = options;
    this.state = {};

    // Pass options to these modules.
    buildHtml = BuildHtml(options);
    parseContent = ParseContent(options);

    // For testing purposes.
    this._buildHtml = buildHtml;
    this._parseContent = parseContent;

    // Destroy it if it exists first.
    tocbot.destroy();

    // Get headings array
    headingsArray = parseContent.selectHeadings(options.contentSelector, options.headingSelector);

    // Build nested headings array.
    var nestedHeadingsObj = parseContent.nestHeadingsArray(headingsArray);
    var nestedHeadings = nestedHeadingsObj.nest;
    console.log(nestedHeadings)

    // Render.
    buildHtml.render(options.tocSelector, nestedHeadings);

    // Update Sidebar and bind listeners.
    buildHtml.updateToc(headingsArray);
    document.addEventListener('scroll', updateTocListener(headingsArray));
    document.addEventListener('resize', updateTocListener(headingsArray));

    // Bind click listeners to disable animation.
    document.addEventListener('click', buildHtml.disableTocAnimation);

    // Initialize smoothscroll if it exists.
    if (options.smoothScroll) {
      this.smoothScroll = options.smoothScroll.init(extend(options.smoothScrollOptions, {
        callback: buildHtml.enableTocAnimation
      }));
    }

    return this;
  };

  /**
   * Refresh tocbot.
   */
  tocbot.refresh = function(customOptions) {
    tocbot.destroy();
    tocbot.init(customOptions || this.options);
  };

  // Make tocbot available globally.
  root.tocbot = tocbot;

  return tocbot;
});
