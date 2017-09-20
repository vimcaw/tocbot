exports.config = {
  'tests': './test/*-test.js',
  'timeout': 10000,
  'output': './test/screenshots-new',
  'helpers': {
    // 'SeleniumWebdriver': {
    //   'smartWait': 5000,
    //   'url': 'http://127.0.0.1:3001',
    //   'browser': 'internet explorer',
    //   'restart': true,
    //   'windowSize': '1000x800',
    //   'timeouts': {
    //     'script': 60000,
    //     'page load': 10000
    //   }
    // },
    'Nightmare': {
      'url': 'http://localhost:3001',
      'show': false,
      'restart': false,
      'windowSize': '1000x800',
      'openDevTools': {
        'mode': 'detach'
      }
    },
    'DiffUtil': {
      'require': './test/diffUtil.js'
    }
  },
  'bootstrap': false,
  'mocha': {},
  'name': 'tocbot'
}
