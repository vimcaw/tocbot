/**
 * This file is responsible for building the DOM and updating DOM state.
 *
 * @author Tim Scanlin
 */

module.exports = function(options) {
  var forEach = [].forEach;
  var some = [].some;
  var body = document.body;
  var currentlyHighlighting = true;

  /**
   * Create link and list elements.
   * @param {Object} d
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  function createEl(d, container) {
    var link = container.appendChild(createLink(d));
    if (d.children.length) {
      var list = createList(d.isCollapsed);
      d.children.forEach(function(child) {
        createEl(child, list);
      });
      link.appendChild(list);
    }
  }

  /**
   * Render nested heading array data into a given selector.
   * @param {String} selector
   * @param {Array} data
   * @return {HTMLElement}
   */
  function render(selector, data) {
    var self = this;
    var collapsed = false;
    var container = createList(collapsed);

    data.forEach(function(d) {
      createEl(d, container);
    });

    var parent = document.querySelector(selector);

    // Remove existing child if it exists.
    if (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }

    // Append the Elements that have been created;
    return parent.appendChild(container);
  }

  /**
   * Create link element.
   * @param {Object} data
   * @return {HTMLElement}
   */
  function createLink(data) {
    var item = document.createElement('li');
    var a = document.createElement('a');
    a.textContent = data.textContent;
    if (options.smoothScroll !== undefined) {
      a.setAttribute('data-scroll', '');
    }
    a.setAttribute('href', '#' + data.id);
    a.setAttribute('class', options.linkClass
      + ' ' + 'node-name--' + data.nodeName
      + ' ' + options.extraLinkClasses);
    item.appendChild(a);
    return item;
  }

  /**
   * Create list element.
   * @param {Boolean} isCollapsed
   * @return {HTMLElement}
   */
  function createList(isCollapsed) {
    var list = document.createElement('ul');
    var classes =  options.listClass
      + ' ' + options.extraListClasses;
    if (isCollapsed) {
      classes += ' ' + options.collapsibleClass;
      classes += ' ' + options.isCollapsedClass;
    }
    list.setAttribute('class', classes);
    return list;
  }

  /**
   * Update fixed sidebar class.
   * @return {HTMLElement}
   */
  function updateFixedSidebarClass() {
    var top = document.documentElement.scrollTop || body.scrollTop;
    var tocEl = document.querySelector(options.tocSelector);

    if (options.fixedSidebarOffset === 'auto') {
      options.fixedSidebarOffset = document.querySelector(options.tocSelector).offsetTop;
    }

    if (top > options.fixedSidebarOffset) {
      tocEl.classList.add(options.positionFixedClass);
    } else {
      tocEl.classList.remove(options.positionFixedClass);
    }
    return tocEl;
  }

  /**
   * Update TOC highlighting and collpased groupings.
   */
  function updateToc(headingsArray) {
    var top = document.documentElement.scrollTop || body.scrollTop;

    // Add fixed class at offset;
    updateFixedSidebarClass();

    // Get the top most heading currently visible on the page so we know what to highlight.
    var headings = headingsArray;
    var topHeader;
    // Using some instead of each so that we can escape early.
    if (currentlyHighlighting
      && document.querySelector(options.tocSelector) !== null
      && headings.length > 0) {
      some.call(headings, function(heading, i) {
        if (heading.offsetTop > top + options.headingsOffset) {
          // Don't allow negative index value.
          var index = (i === 0) ? i : i - 1;
          topHeader = headings[index];
          return true;
        } else if (i === headings.length - 1) {
          // This allows scrolling for the last heading on the page.
          topHeader = headings[headings.length - 1];
          return true;
        }
      });

      // Remove the active class from the other tocLinks.
      var tocLinks = document.querySelector(options.tocSelector)
        .querySelectorAll('.' + options.linkClass);
      forEach.call(tocLinks, function(tocLink) {
        tocLink.classList.remove(options.activeLinkClass);
      });

      // Add the active class to the active tocLink.
      var activeTocLink = document.querySelector(options.tocSelector)
        .querySelector('.' + options.linkClass
          + '.node-name--' + topHeader.nodeName
          + '[href="#' + topHeader.id + '"]');
      activeTocLink.classList.add(options.activeLinkClass);

      var tocLists = document.querySelector(options.tocSelector)
        .querySelectorAll('.' + options.listClass + '.' + options.collapsibleClass);

      // Collapse the other collapsible lists.
      forEach.call(tocLists, function(list) {
        list.classList.add(options.isCollapsedClass);
      });

      // Expand the active link's collapsible list and its sibling if applicable.
      if (activeTocLink.nextSibling) {
        activeTocLink.nextSibling.classList.remove(options.isCollapsedClass);
      }
      removeCollapsedFromParents(activeTocLink.parentNode.parentNode);
    }
  }

  /**
   * Remove collpased class from parent elements.
   * @param {HTMLElement} element
   * @return {HTMLElement}
   */
  function removeCollapsedFromParents(element) {
    if (element.classList.contains(options.collapsibleClass)) {
      element.classList.remove(options.isCollapsedClass);
      return removeCollapsedFromParents(element.parentNode.parentNode);
    }
    return element;
  }

  /**
   * Disable TOC Animation when a link is clicked.
   * @param {Event} event
   */
  function disableTocAnimation(event) {
    var target = event.target || event.srcElement;
    if (!target.classList.contains(options.linkClass)) {
      return;
    }
    // Bind to tocLink clicks to temporarily disable highlighting
    // while smoothScroll is animating.
    if (!!options.smoothScroll) {
      currentlyHighlighting = false;
    }
  }

  function enableTocAnimation() {
    currentlyHighlighting = true;
  }

  return {
    enableTocAnimation: enableTocAnimation,
    disableTocAnimation: disableTocAnimation,
    render: render,
    updateToc: updateToc
  };
};
