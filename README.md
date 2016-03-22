---
template: default
title: Tocbot
---

<h1 class="display--none"><a href="http://tscanlin.github.io/tocbot">Tocbot</a></h1>

<h2 id="introduction"  class="hard flush">Introduction</h2>

tocbot is a small script to build a table of contents (TOC) from headings in an HTML document. tocbot works well with [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll) and together they provide an experience very similar to [Tocify](http://gregfranko.com/jquery.tocify.js/).

This script is particularly useful for documentation websites or long markdown pages.


## Get Started

You can include the script on the page with HTML or use npm to install it.


### Include JS

Include the script at the bottom of the page before the closing body tag.

```html
<script src="/js/tocbot.js"></script>
<script src="/js/smooth-scroll.js"></script>
```

OR

Install it with npm.

```sh
npm install --save tocbot
```

And optionally.

```sh
npm install --save cferdinandi/smooth-scroll
```

Then require them.

```javascript
var tocbot = require('tocbot');
var smoothScroll = require('smooth-scroll');
```


### Include CSS

CSS is used for expanding & collapsing groupings and some basic styling. The core of what's required is only 24 lines unminified.

```html
<link rel="stylesheet" href="http://tscanlin.github.io/tocbot/css/style.css">
```

OR

If you installed it with npm and use sass / postcss you might try importing the styles from the folder in 'node_modules', [see the includePath docs for more info](https://github.com/sass/node-sass#includepaths)

```scss
@import 'tocbot/src/scss/style';
```


### Usage

Initialize the script

```javascript
tocbot.init({
  // Where to render the table of contents.
  tocSelector: '.js-toc',
  // Where to grab the headings to build the table of contents.
  contentSelector: '.js-content',
  // Optionally include reference to smoothScroll.
  smoothScroll: smoothScroll || window.smoothScroll
});
```

If content in the div has changed then trigger a refresh (optionally with new options).

```javascript
tocbot.refresh();
```


## Requirements

There is no need for jQuery as this library uses **vanilla javascript** and is only about 500 lines unminified.

There are no external dependencies for this script, besides [**Smooth Scroll**](https://github.com/cferdinandi/smooth-scroll) (which also has no dependencies) should you choose to include it.

This script works in **all modern browsers and IE > 9**. To get support for older versions of IE please use polyfills.

Make sure rendered headings have id attributes, github pages and many markdown renderers (like [marked](https://github.com/chjj/marked)) already do this.


## API

### Options

```javascript
var defaultOptions = {
  // Where to render the table of contents.
  tocSelector: '.js-toc',
  // Where to grab the headings to build the table of contents.
  contentSelector: '.js-content',


  // Reference to smoothScroll
  smoothScroll: undefined,
  // smoothScroll Options
  smoothScrollOptions: {
    easing: 'easeInOutCubic',
    offset: 0,
    speed: 300, // animation duration.
    updateURL: true,
  },


  // Which headings to grab inside of the contentSelector element.
  headingsToSelect: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
  ],
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
  extraLinkClasses: 'color--base',
  // Main class to add to lists.
  listClass: 'toc-list',
  // Extra classes to add to lists.
  extraListClasses: 'soft--left',
  // Headings offset between the headings and the top of the document (helps with weird rounding bugs that pop up).
  headingsOffset: 2,


  // Class that gets added when a list should be collapsed.
  isCollapsedClass: 'is-collapsed',
  // Class that gets added when a list should be able to be collapsed but isn't necessarily collpased.
  collapsibleClass: 'collapsible',
  // How many heading levels should not be collpased. For example, number 6 will show everything since there are only 6 heading levels and number 0 will collpase them all.
  collapseDepth: 0,
};
```

### Methods

#### .init

Initialize tocbot with an options object.

```javascript
tocbot.init(options)
```

#### .destroy

Destroy tocbot.

```javascript
tocbot.destroy()
```

#### .refresh

Refresh tocbot.

```javascript
tocbot.refresh()
```


## Roadmap

- More tests
- Blog post to announce it
- Eventually, a place to drop in markdown to preview it
- Debounce option
- React.js support


## Changelog

### v1.0
- Publicly launched


## Contributing

Contributions and suggestions are welcome! Please feel free to open an issue if you run into a problem or have a feature request. I'll do my best to respond in a timely fashion.

If you want to open a pull request just fork the repo but please make sure all tests and lint pass first.

### Running Tests

`gulp test`

[//]: # (FAQ)


## License

[MIT]('http://opensource.org/licenses/MIT')
