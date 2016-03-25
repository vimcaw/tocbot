var chai = require('chai');
var expect = chai.expect;
var doc = document;

mocha.setup({
  ui: 'bdd'
})

beforeEach(function() {
  tocbot.refresh({
    smoothScroll: window.smoothScroll
  });
})

after(function() {
  window.location.hash = '#';
})

describe('Build HTML', function () {
  it('should render TOC properly with default options', function () {
    var tocEl = document.querySelector(tocbot.options.tocSelector);
    var html = '<ul class="toc-list ">\
<li><a data-scroll="" href="#bacon" class="toc-link node-name--H1 is-active-link">Bacon</a>\
<ul class="toc-list  collapsible"><li><a data-scroll="" href="#brisket" class="toc-link node-name--H2 ">Brisket</a></li><li><a data-scroll="" href="#flank" class="toc-link node-name--H2 ">Flank</a>\
<ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#pork" class="toc-link node-name--H3 ">Pork</a></li></ul></li><li><a data-scroll="" href="#capicola" class="toc-link node-name--H2 ">Capicola</a>\
<ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#drumstick" class="toc-link node-name--H3 ">Drumstick</a></li><li><a data-scroll="" href="#pastrami" class="toc-link node-name--H3 ">Pastrami</a></li><li><a data-scroll="" href="#meatloaf" class="toc-link node-name--H3 ">Meatloaf</a></li></ul></li></ul></li><li><a data-scroll="" href="#sirloin" class="toc-link node-name--H1 ">Sirloin</a>\
<ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#pork-belly" class="toc-link node-name--H2 ">Pork belly</a></li><li><a data-scroll="" href="#bresaola-shankle" class="toc-link node-name--H2 ">Bresaola shankle</a></li><li><a data-scroll="" href="#cow-pancetta" class="toc-link node-name--H2 ">Cow pancetta</a>\
<ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#turducken" class="toc-link node-name--H3 ">Turducken</a></li><li><a data-scroll="" href="#alcatra" class="toc-link node-name--H3 ">Alcatra</a></li><li><a data-scroll="" href="#chuck" class="toc-link node-name--H3 ">Chuck</a></li><li><a data-scroll="" href="#spare-ribs" class="toc-link node-name--H3 ">Spare ribs</a>\
<ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#chuck-venison" class="toc-link node-name--H5 ">Chuck venison</a></li></ul></li></ul></li><li><a data-scroll="" href="#swine-venison-chicken" class="toc-link node-name--H2 ">Swine venison chicken</a></li></ul></li><li><a data-scroll="" href="#landjaeger" class="toc-link node-name--H1 ">Landjaeger</a>\
<ul class="toc-list  collapsible is-collapsed"><li><a data-scroll="" href="#kevin-capicola-shank" class="toc-link node-name--H3 ">Kevin capicola shank</a></li></ul></li></ul>';
    expect(tocEl.innerHTML).to.contain(html);
  });

  it('should add the active class and show its children when a link is clicked', function (done) {
    var e = new Event('click');
    var target = document.querySelector('[href="#capicola"]');
    target.dispatchEvent(e);

    expect(document.body.scrollTop).to.equal(1427);
    expect(window.location.hash).to.equal('#capicola');
    setTimeout(function() { // give event handler time to respond since its async.
      expect(target.classList.contains(tocbot.options.activeLinkClass)).to.equal(true);
      expect(target.nextSibling.classList.contains(tocbot.options.isCollapsedClass)).to.equal(false);
      done();
    }, 10);
  });

  it('should properly serialize the data', function () {
    var parse = tocbot._parseContent;
    var headings = parse.selectHeadings(tocbot.options.contentSelector, tocbot.options.headingSelector);
    expect(headings.length).to.equal(20);

    var nest = require('./test-data.js')();

    var nestObj = parse.nestHeadingsArray(headings);
    expect(nestObj.nest).to.eql(nest);
  });
})
