
Feature('Index');

Scenario('test something', (I) => {
  console.log(I);
  I.amOnPage('/')
  // I.fillField('Email', 'hello@world.com')
  // I.fillField('Password', '123456')
  // I.checkOption('Active')
  // I.checkOption('Male');
  // I.click('Create User')
  I.wait(1)
  I.see('Tocbot')
  I.saveScreenshot('tocbot.png', true)
});
