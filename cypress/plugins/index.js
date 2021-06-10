const dotenvPlugin = require('cypress-dotenv');
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('before:browser:launch', (browser, launchOptions) => {
    console.log("Print browser name: "+browser.name);

    if (browser.name === 'chrome') {
        // launch chrome using incognito
        launchOptions.args.push(' --incognito')
        return launchOptions
    }
  });

  config = dotenvPlugin(config)                                                                           
   return config
};
