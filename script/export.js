const { join, basename, dirname, extname, relative, resolve } = require('path')
const { renderToString, renderToStaticMarkup } = require('react-dom/server')
const { loadGetStaticInitialProps } = require('next/dist/lib/utils')
const Head = require('next/dist/lib/head') // , { defaultHead }
const { Router } = require('next/dist/lib/router')
const { createElement } = require('react')
// replace
const readPage = require('./read-page')


const glob = require('glob-promise')
const mkdir = require('mkdirp-then')
// const resolve = require('./resolve')
const App = require('next/dist/lib/app')
const fs = require('fs-promise')


/**
 * Export to Static HTML
 */

module.exports = function Export ({
  staticMarkup = false,
  dir = process.cwd(),
  out = 'site',
  dev = false
} = {}) {
  const nextPath = join(dir, '.next')
  const pageDir = join(nextPath, 'dist', 'pages')
  const exportPath = pathResolve(dir, out)

  let pages = await glob(join(pageDir, '**', '*.js'))
  pages = pages.filter(page => basename(page)[0] !== '_')

  // load the top-level document
  const Document = require(join(nextPath, 'dist', 'pages', '_document.js')).default
  await mkdir(exportPath)

  // copy over the common bundle
  await fs.copy(join(nextPath, 'app.js'), join(exportPath, 'app.js'))

  // build all the pages
  await Promise.all(pages.map(async (page) => {
    const pathname = toRoute(pageDir, page)
    const pageName = getPageName(pageDir, page)
    const Component = require(page).default
    const query = {}
    const ctx = { pathname, query }
    const bundlePath = await resolve(join(nextPath, 'bundles', 'pages', pageName))

    const [
      props,
      component,
      errorComponent
    ] = await Promise.all([
      loadGetStaticInitialProps(Component, ctx),
      readPage(bundlePath),
      readPage(join(nextPath, 'bundles', 'pages', '_error'))
    ])

    const renderPage = () => {
      const app = createElement(App, {
        Component,
        props,
        // TODO: figure out if err is relevant with `next build`
        // err: dev ? err : null,
        router: new Router(pathname, query)
      })

      const render = staticMarkup ? renderToStaticMarkup : renderToString

      let html
      let head
      try {
        html = render(app)
      } finally {
        head = Head.rewind() || defaultHead()
      }
      return { html, head }
    }

    const docProps = await loadGetStaticInitialProps(Document, Object.assign(ctx, { renderPage }))
    const doc = createElement(Document, Object.assign({
      __NEXT_DATA__: {
        component: component,
        errorComponent,
        props,
        pathname,
        query,
        // TODO: figure out if we need/want build stats when we export
        // buildId,
        // buildStats,
        exported: true
        // TODO: needed for static builds?
        // err: (err && dev) ? errorToJSON(err) : null
      },
      dev,
      staticMarkup
    }, docProps))

    const html = '<!DOCTYPE html>' + renderToStaticMarkup(doc)

    // write files
    const htmlPath = join(exportPath, pathname)
    await mkdir(htmlPath)
    await fs.writeFile(join(htmlPath, 'index.html'), html)

    // copy component bundle over
    await fs.copy(bundlePath, join(htmlPath, 'index.json'))
  }))

   // copy over the static/
  await fs.copy(join(dir, 'static'), join(exportPath, 'static'))
}

// Turn the path into a route
//
// e.g.
//  - index.js        => /
//  - about.js        => /about
//  - movies/index.js => /movies
function toRoute (pageDir, entry) {
  const page = '/' + relative(pageDir, entry)
  const base = basename(page, extname(page))
  if (base === 'index') {
    const dir = dirname(page)
    return dir === '/' ? '/' : dir
  } else {
    return '/' + base
  }
}

// Get the page name
//
// e.g.
//  - index.js        => index
//  - about.js        => about
//  - movies/index.js => movies
function getPageName (pageDir, entry) {
  const page = '/' + relative(pageDir, entry)
  const base = basename(page, extname(page))
  if (base === 'index') {
    const dir = basename(dirname(page))
    return dir === '' ? 'index' : dir
  } else {
    return base
  }
}
