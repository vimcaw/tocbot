module.exports = {
  // Where to render the table of contents.
  tocSelector: '.js-toc',
  // Where to grab the headings to build the table of contents.
  contentSelector: '.js-content',
  // Which headings to grab inside of the contentSelector element.
  headingSelector: 'h1, h2, h3',

  // Reference to smoothScroll
  smoothScroll: undefined,
  // smoothScroll Options, see docs at: https://github.com/cferdinandi/smooth-scroll
  smoothScrollOptions: {
    easing: 'easeInOutCubic',
    offset: 0,
    speed: 300, // animation duration.
    updateURL: true,
  },

  // Class to add to active links (the link corresponding to the top most heading on the page).
  activeLinkClass: 'is-active-link',
  // Headings that match the ignoreSelector will be skipped.
  ignoreSelector: '.skip-toc',
  // Fixed position class to add to make sidebar fixed after scrolling down past the fixedSidebarOffset.
  positionFixedClass: 'is-position-fixed',
  // fixedSidebarOffset can be any number but by default is set to auto which sets the fixedSidebarOffset to the sidebar element's offsetTop from the top of the document on init.
  fixedSidebarOffset: 'auto',

  // Main class to add to links.
  linkClass: 'toc-link',
  // Extra classes to add to links.
  extraLinkClasses: '',
  // Main class to add to lists.
  listClass: 'toc-list',
  // Extra classes to add to lists.
  extraListClasses: '',
  // Headings offset between the headings and the top of the document (helps with weird rounding bugs that pop up).
  headingsOffset: 0,

  // Class that gets added when a list should be collapsed.
  isCollapsedClass: 'is-collapsed',
  // Class that gets added when a list should be able to be collapsed but isn't necessarily collpased.
  collapsibleClass: 'collapsible',
  // How many heading levels should not be collpased. For example, number 6 will show everything since there are only 6 heading levels and number 0 will collpase them all.
  collapseDepth: 0,
  // This is storing current state and not really a setting...
  // TODO: Handle this better, maybe bring back a state object??
  _currentlyHighlighting: true,
};
