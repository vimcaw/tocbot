const { join, basename, dirname, extname, relative, resolve } = require('path')
const { renderToString, renderToStaticMarkup } = require('react-dom/server')
const Head = require('next/dist/lib/head') // , { defaultHead }
const { Router } = require('next/dist/lib/router')
const { createElement } = require('react')
// replace
const glob = require('glob-promise')
const mkdir = require('mkdirp-then')
const App = require('next/dist/lib/app')
const fs = require('fs-promise')


/**
 * Export to Static HTML
 */


module.exports = function Export () {
  const staticMarkup = false
  const dir = process.cwd()
  const out = 'site'
  const dev = false
  const nextPath = join(dir, '.next')
  const pageDir = join(nextPath, 'dist', 'pages')
  const exportPath = join(dir, out)

  glob(join(pageDir, '**', '*.js')).then((pages) => {
    pages = pages.filter(page => basename(page)[0] !== '_')

    // load the top-level document
    const Document = require(join(nextPath, 'dist', 'pages', '_document.js')).default
    mkdir(exportPath, (err, d) => {
      // copy over the common bundle
      fs.copy(join(nextPath, 'app.js'), join(exportPath, 'app.js')) // await
    }) // await

    // build all the pages
    Promise.all(pages.map((page) => {
      const pathname = toRoute(pageDir, page)
      const pageName = getPageName(pageDir, page)
      const Component = require(page).default
      const query = {}
      const ctx = { pathname, query }
      const bundlePath = join(nextPath, 'bundles', 'pages', pageName)
      console.log(bundlePath);

      Promise.all([
        loadGetStaticInitialProps(Component, ctx),
        // readPage(bundlePath),
        // readPage(join(nextPath, 'bundles', 'pages', '_error'))
      ]).then((data) => {
        // const = [
        //   props,
        //   component,
        //   errorComponent
        // ] = data
        console.log(data);
      })

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

      loadGetStaticInitialProps(Document, Object.assign(ctx, { renderPage })).then((docProps) => {
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
        mkdir(htmlPath, (err, d) => {
          fs.writeFile(join(htmlPath, 'index.html'), html)
        })
      })


      // copy component bundle over
      // await fs.copy(bundlePath, join(htmlPath, 'index.json'))
    }))

  })


   // copy over the static/
  // await fs.copy(join(dir, 'static'), join(exportPath, 'static'))
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

function loadGetStaticInitialProps (Component, ctx) {
  if (!Component.getStaticInitialProps) return Promise.resolve({})
  return Component.getStaticInitialProps(ctx).then((props) => {
    if (!props) {
      const compName = Component.displayName || Component.name
      const message = `"${compName}.getStaticInitialProps()" should resolve to an object. But found "${props}" instead.`
      throw new Error(message)
    }
    return props
  })
}
