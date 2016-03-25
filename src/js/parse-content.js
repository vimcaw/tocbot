// DATA

module.exports = function(options) {
  var reduce = [].reduce;

  /**
   * Select headings in content area, exclude any selector in options.ignoreSelector
   * @param {String} contentSelector
   * @param {Array} headingSelector
   * @return {Array}
   */
  function selectHeadings(contentSelector, headingSelector) {
    if (options.ignoreSelector) {
      headingSelector = headingSelector
        .split(',')
        .map(function(selector) {
          return selector.trim() + ':not(' + options.ignoreSelector + ')';
        });
    }
    return document.querySelector(contentSelector)
      .querySelectorAll(headingSelector);
  }

  /**
   * Nest headings array into nested arrays with 'children' property.
   * @param {Array} headingsArray
   * @param {Function} callback
   * @return {Object}
   */
  function nestHeadingsArray(headingsArray, callback) {
    return reduce.call(headingsArray, function(prev, curr, index) {
      var currentHeading = getHeadingObject(curr);
      prev.lastItem = curr;

      addNode(currentHeading, prev.nest)
      return prev;
    }, {
      lastItem: undefined,
      nest: [],
    });
  }

  /**
   * Add a node to the nested array.
   * @param {Object} node
   * @param {Array} nest
   * @return {Array}
   */
  function addNode(node, nest) {
    var level = getHeadingLevel(node);
    var array = nest;
    var lastItem = getLastItem(array);
    var lastItemLevel = lastItem
      ? lastItem.headingLevel
      : 0;
    var counter = level - lastItemLevel;

    while(counter > 0) {
      lastItem = getLastItem(array);
      if (lastItem && lastItem.children !== undefined) {
        array = lastItem.children;
      }
      counter--;
    }

    if (level >= options.collapseDepth) {
      node.isCollapsed = true;
    }

    array.push(node);
    return array;
  }

  /**
   * Get the last item in an array and return a reference to it.
   * @param {Array} array
   * @return {Object}
   */
  function getLastItem(array) {
    return array[array.length - 1];
  }

  /**
   * Get heading level for a heading dom node.
   * @param {HTMLElement} heading
   * @return {Number}
   */
  function getHeadingLevel(heading) {
    return +heading.nodeName.split('H').join('');
  }

  /**
   * Get important properties from a heading element and store in a plain object.
   * @param {HTMLElement} heading
   * @return {Object}
   */
  function getHeadingObject(heading) {
    return {
      id: heading.id,
      children: [],
      nodeName: heading.nodeName,
      headingLevel: getHeadingLevel(heading),
      textContent: heading.textContent.trim(),
    };
  }

  return {
    nestHeadingsArray: nestHeadingsArray,
    selectHeadings: selectHeadings
  };
}
