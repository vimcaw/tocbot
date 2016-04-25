<h1 class="display--none"><a href="http://tscanlin.github.io/tocbot">Tocbot</a></h1>


Tocbot builds a table of contents (TOC) from headings in an HTML document. This is particularly useful for documentation websites or long markdown pages because it makes them easier to navigate. This library was inspired by [Tocify](http://gregfranko.com/jquery.tocify.js/), the main difference is that Tocbot uses native DOM methods and avoids the jQuery & jQuery UI dependencies.


## Get Started

You can use npm to install it or include the script on the page with HTML.


### Include JS

Install it with npm.

```sh
npm install --save tocbot
```

OR

Include the script at the bottom of the page before the closing body tag.

```html
<script src="/assets/js/tocbot.js"></script>
```


### Include CSS

CSS is used for expanding & collapsing groupings and some basic styling.

```html
<link rel="stylesheet" href="/assets/css/tocbot.css">
```

OR

If you installed it with npm and use sass / postcss you might try importing the styles from the folder in 'node_modules', [see the includePath docs for more info](https://github.com/sass/node-sass#includepaths)

```scss
@import 'tocbot/src/scss/tocbot';
```


### Usage

Initialize the script

```javascript
tocbot.init({
  // Where to render the table of contents.
  tocSelector: '.js-toc',
  // Where to grab the headings to build the table of contents.
  contentSelector: '.js-toc-content',
});
```

If content in the div has changed then trigger a refresh (optionally with new options).

```javascript
tocbot.refresh();
```


## Requirements

This library uses **vanilla javascript** and is only about 500 lines unminified. The only dependency this script has is [**Smooth Scroll**](https://github.com/cferdinandi/smooth-scroll) (which has no dependencies). This script works in **all modern browsers and IE 8+**. To get support for older versions of IE use polyfills.

Make sure rendered headings have id attributes, some markdown libraries (like [marked](https://github.com/chjj/marked)) already do this.


## API

### Options

```javascript
// Where to render the table of contents.
tocSelector: '.js-toc',
// Where to grab the headings to build the table of contents.
contentSelector: '.js-toc-content',
// Which headings to grab inside of the contentSelector element.
headingSelector: 'h1, h2, h3',

// smoothScroll Options, see docs at: https://github.com/cferdinandi/smooth-scroll
smoothScrollOptions: {
  easing: 'easeInOutCubic',
  offset: 0,
  speed: 300, // animation duration.
  updateURL: true
},

// Class to add to active links (the link corresponding to the top most heading on the page).
activeLinkClass: 'is-active-link',
// Headings that match the ignoreSelector will be skipped.
ignoreSelector: '.js-toc-ignore',
// Fixed position class to add to make sidebar fixed after scrolling
// down past the fixedSidebarOffset.
positionFixedClass: 'is-position-fixed',
// fixedSidebarOffset can be any number but by default is set to auto which
// sets the fixedSidebarOffset to the sidebar element's offsetTop from the
// top of the document on init.
fixedSidebarOffset: 'auto',

// Main class to add to links.
linkClass: 'toc-link',
// Extra classes to add to links.
extraLinkClasses: '',
// Main class to add to lists.
listClass: 'toc-list',
// Extra classes to add to lists.
extraListClasses: '',
// Headings offset between the headings and the top of the document.
headingsOffset: 0,

// Class that gets added when a list should be collapsed.
isCollapsedClass: 'is-collapsed',
// Class that gets added when a list should be able to be collapsed but
// isn't necessarily collpased.
collapsibleClass: 'is-collapsible',
// How many heading levels should not be collpased. For example, number 6
// will show everything since there are only 6 heading levels and number 0 will collpase them all.
collapseDepth: 0
```


### Methods

#### .init

Initialize tocbot with an options object.

```javascript
tocbot.init(options)
```

#### .destroy

Destroy tocbot and remove event listeners.

```javascript
tocbot.destroy()
```

#### .refresh

Refresh tocbot if the document changes and it needs to be rebuilt.

```javascript
tocbot.refresh()
```


## Roadmap

- More tests
- Blog post to announce it
- Option for changing the url hash on scroll
- React.js support


## Changelog

### v1.0
- First published source code


## Contributing

Contributions and suggestions are welcome! Please feel free to open an issue if you run into a problem or have a feature request. I'll do my best to respond in a timely fashion.

If you want to open a pull request just fork the repo but please make sure all tests and lint pass first.


### Running Tests

`npm test`


## License

[MIT]('http://opensource.org/licenses/MIT')
