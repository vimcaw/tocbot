// DATA

module.exports = function(options) {
  var reduce = [].reduce;

  /**
   * Select headings in content area, exclude any selector in options.excludeSelector
   * @param {String} contentSelector
   * @param {Array} headingsToSelect
   * @return {Array}
   */
  function selectHeadings(contentSelector, headingsToSelect) {
    if (options.excludeSelector) {
      headingsToSelect = headingsToSelect.map(function(selector) {
        return selector + ':not(' + options.excludeSelector + ')';
      });
    }
    return document.querySelector(contentSelector)
      .querySelectorAll(headingsToSelect.join(', '));
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
      var depth = getHeadingLevel(curr) - 1;
      prev.lastItem = curr;

      appendNodeAtDepth(currentHeading, depth, prev.nest)
      return prev;
    }, {
      lastItem: undefined,
      nest: [],
    });
  }

  /**
   * Append node at a specific depth in the nested array.
   * @param {Object} node
   * @param {Number} depth
   * @param {Array} array
   * @return {Array}
   */
  function appendNodeAtDepth(node, depth, array) {
    var counter = depth;
    while(counter > 0) {
      var lastItem = getLastItem(array);
      if (lastItem && lastItem.children !== undefined) {
        array = lastItem.children;
      }
      counter--;
    }

    if (depth >= options.collapseDepth) {
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
      textContent: heading.textContent.trim(),
    };
  }

  return {
    nestHeadingsArray: nestHeadingsArray,
    selectHeadings: selectHeadings
  };
}
