
Feature('Index')

Scenario('test page load', (I) => {
  I.amOnPage('/')
  I.see('Tocbot')
  I.seeElement('.is-active-link')
  I.saveScreenshot('tocbot.png')
  // I.diffScreenshot('tocbot.png')
})

Scenario('test clicking scrolls', (I) => {
  I.refresh ? I.refresh() : I.amOnPage('/')
  I.see('Tocbot')
  I.seeElement('.is-active-link')
  I.click('a[href="#examples"]')
  I.wait(1)
  I.saveScreenshot('tocbot-scroll.png')
  // I.diffScreenshot('tocbot.png')
})
