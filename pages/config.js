function isNode() {
  return typeof window === 'undefined'
}

function getPathPrefix() {
  return isNode() ? '/tocbot' : ''
}

export default {
  title: 'Tocbot',
  subtitle: 'Generate a table of contents based on the heading structure of an html document',
  description: 'Tocbot - Generate a table of contents based on the heading structure of an html document',
  stylesheets: [
    'https://unpkg.com/tachyons@4.7.0/css/tachyons.min.css',
    getPathPrefix() + '/static/css/tocbot.css',
    getPathPrefix() + '/static/css/styles.css',
  ],
  topLinks: [
    {
      text: 'About',
      href: getPathPrefix() + '/'
    },
    {
      text: 'Changelog',
      href: getPathPrefix() + '/changelog'
    },
    {
      text: 'Github',
      href: 'https://github.com/tscanlin/tocbot'
    },
  ],
  user: 'tscanlin',
  repo: 'tocbot',
  siteId: 'UA-76620957-1',
}
