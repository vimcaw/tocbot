module.exports = {
  useWrapper: true,
  wrapperLocation: './src/templates/wrapper.html',
  wrapperInsertionPoint: '<!-- APP_CONTENT_HERE -->',
  renderPath: 'dist/',
  pathMap: {
    'README.md': {
      path: 'index.html',
      component: 'Default'
    },
    'docs/test/test.md': {
      path: 'docs/test/test.html',
      component: 'Default'
    }
  }
};
