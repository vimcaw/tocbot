var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
// Count all of the links from the io.js build page
var jsdom = require('jsdom');

var GLOBAL = {
  window: {}
};

function spy(fn) {
  var args = [];
  var fun = function() {
    args.push([].slice.call(arguments));
    return fn(arguments);
  };
  fun._args = args;
  return fun;
}

var content = fs.readFileSync('./test/data/sample-react-readme.html').toString();
var markup = '<html><head></head><body>'
  + content
  + '</body></html>';

before(function(done) {
  jsdom.env(
    markup,
    [
      './build/assets/js/tocbot.js'
    ],
    function (err, window) {
      GLOBAL.window = window;

      // Init.
      // window.tocbot.init();
      // console.log(window.tocbot)

      done();
    }
  );
});

beforeEach(function() {
  GLOBAL.window.tocbot.init();
});

afterEach(function() {
  GLOBAL.window.tocbot.destroy();
});

describe('Tocbot', function () {
  describe('Initialize', function () {
    it('should expose a global object', function () {
      expect(GLOBAL.window.tocbot).to.not.equal(undefined);
    });

    it('should expose public functions', function () {
      expect(GLOBAL.window.tocbot.init).to.be.a('function');
      expect(GLOBAL.window.tocbot.destroy).to.be.a('function');
      expect(GLOBAL.window.tocbot.refresh).to.be.a('function');
    });

    it('should add event listeners when initialized', function () {
      GLOBAL.window.tocbot.destroy();
      var count = 0;
      var args = [];

      GLOBAL.window.document.addEventListener = function() {
        args.push([].slice.call(arguments));
        count++;
      };

      GLOBAL.window.tocbot.init();

      var eventTypes = args.map(function(arg) {
        return arg[0];
      });
      expect(eventTypes).to.contain('scroll');
      expect(eventTypes).to.contain('resize');
      expect(eventTypes).to.contain('click');
      // The 4th event is added by smooth-scroll.
      expect(count).to.equal(4);
    });
  });

  describe('Destroy', function () {
    it('should remove event listeners when destroyed', function () {
      var count = 0;
      var args = [];

      GLOBAL.window.document.removeEventListener = function() {
        args.push([].slice.call(arguments));
        count++;
      };

      GLOBAL.window.tocbot.destroy();

      var eventTypes = args.map(function(arg) {
        return arg[0];
      });
      expect(eventTypes).to.contain('scroll');
      expect(eventTypes).to.contain('resize');
      expect(eventTypes).to.contain('click');
      // The 4th event is added by smooth-scroll.
      expect(count).to.equal(4);
    });
  });
});

xdescribe('Build HTML', function () {
  xit('should render TOC properly with default options', function () {
    var window = GLOBAL.window;
    var doc = window.document;
    // console.log(doc.body.clientWidth)
    // var tocEl = doc.querySelector(window.tocbot.options);

    console.log(window.tocbot)
    // console.log(tocEl.className)

//     var html = '<ul class="toc-list ">\
// <li><a data-scroll="" href="#bacon" class="toc-link node-name--H1 is-active-link">Bacon</a>\
// <ul class="toc-list  collapsible"><li><a data-scroll="" href="#brisket" class="toc-link node-name--H2 ">Brisket</a></li><li><a data-scroll="" href="#flank" class="toc-link node-name--H2 ">Flank</a>\
// <ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#pork" class="toc-link node-name--H3 ">Pork</a></li></ul></li><li><a data-scroll="" href="#capicola" class="toc-link node-name--H2 ">Capicola</a>\
// <ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#drumstick" class="toc-link node-name--H3 ">Drumstick</a></li><li><a data-scroll="" href="#pastrami" class="toc-link node-name--H3 ">Pastrami</a></li><li><a data-scroll="" href="#meatloaf" class="toc-link node-name--H3 ">Meatloaf</a></li></ul></li></ul></li><li><a data-scroll="" href="#sirloin" class="toc-link node-name--H1 ">Sirloin</a>\
// <ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#pork-belly" class="toc-link node-name--H2 ">Pork belly</a></li><li><a data-scroll="" href="#bresaola-shankle" class="toc-link node-name--H2 ">Bresaola shankle</a></li><li><a data-scroll="" href="#cow-pancetta" class="toc-link node-name--H2 ">Cow pancetta</a>\
// <ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#turducken" class="toc-link node-name--H3 ">Turducken</a></li><li><a data-scroll="" href="#alcatra" class="toc-link node-name--H3 ">Alcatra</a></li><li><a data-scroll="" href="#chuck" class="toc-link node-name--H3 ">Chuck</a></li><li><a data-scroll="" href="#spare-ribs" class="toc-link node-name--H3 ">Spare ribs</a>\
// <ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#chuck-venison" class="toc-link node-name--H5 ">Chuck venison</a></li></ul></li></ul></li><li><a data-scroll="" href="#swine-venison-chicken" class="toc-link node-name--H2 ">Swine venison chicken</a></li></ul></li><li><a data-scroll="" href="#landjaeger" class="toc-link node-name--H1 ">Landjaeger</a>\
// <ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#kevin-capicola-shank" class="toc-link node-name--H3 ">Kevin capicola shank</a></li></ul></li></ul>';
    // console.log(tocEl.innerHTML)
    // expect(tocEl.innerHTML).to.contain(html);
  });

  xit('should add the active class and show its children when a link is clicked', function (done) {
    var e = new window.Event('click');
    var target = window.document.querySelector('[href="#capicola"]');
    target.dispatchEvent(e);

    expect(window.document.body.scrollTop).to.equal(1427);
    expect(window.location.hash).to.equal('#capicola');
    setTimeout(function() { // give event handler time to respond since its async.
      expect(target.classList.contains(window.tocbot.options.activeLinkClass)).to.equal(true);
      expect(target.nextSibling.classList.contains(window.tocbot.options.isCollapsedClass)).to.equal(false);
      done();
    }, 10);
  });

  xit('should properly serialize the data', function () {
    var window = GLOBAL.window;
    var parse = window.tocbot._parseContent;
    var headings = parse.selectHeadings(window.tocbot.options.contentSelector, window.tocbot.options.headingSelector);
    expect(headings.length).to.equal(20);

    var nest = require('./test-data.js')();

    var nestObj = parse.nestHeadingsArray(headings);
    expect(nestObj.nest).to.eql(nest);
  });
});
