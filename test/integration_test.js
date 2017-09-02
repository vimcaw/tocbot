
Feature('Index');

Scenario('test page load', (I) => {
  I.amOnPage('/')
  I.see('Tocbot')
  I.seeElement('.toc-link')
  // I.wait(1)
  I.saveScreenshot('tocbot.png', true)
});
