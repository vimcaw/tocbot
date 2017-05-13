const { join, basename, dirname, extname, relative, resolve } = require('path')
const { renderToString, renderToStaticMarkup } = require('react-dom/server')
const Head = require('next/dist/lib/head').default
const defaultHead = require('next/dist/lib/head').defaultHead
const { Router } = require('next/dist/lib/router')
const { createElement } = require('react')
const glob = require('glob-promise')
const mkdir = require('mkdirp-then')
const App = require('next/dist/lib/app').default
const fs = require('fs-promise')
const nextConfig = require('../next.config.js')


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
  const buildId = Date.now()
  const buildStats = {}

  glob(join(pageDir, '**', '*.js')).then((pages) => {
    let errorPage
    const filteredPages = pages.filter(page => {
      if (basename(page) === '_error.js') {
        errorPage = page
        return true
      }
      return basename(page)[0] !== '_'
    })
    const errorComponent = require(errorPage).default

    // load the top-level document
    const Document = require(join(nextPath, 'dist', 'pages', '_document.js')).default
    mkdir(exportPath, (err, d) => {
      fs.copy(join(nextPath, 'app.js'), join(exportPath, nextConfig.assetPrefix, 'app.js')) // await
      fs.copy(join(nextPath, 'bundles', 'pages'), join(exportPath, nextConfig.assetPrefix, 'page')) // await
      // App js path

      const appJsPath = join(exportPath, nextConfig.assetPrefix, '_next', ''+buildId, 'page')
      fs.copy(join(nextPath, 'bundles', 'pages'), appJsPath, (err, data) => {
        return glob(join(appJsPath, '**', '*.js')).then((files) => {
          return Promise.all(files.map((f) => fs.renameSync(f, f.split('.js').join(''))))

        })
      }) // await
      // fs.copy(join(nextPath, 'bundles'), join(exportPath, 'bundles')) // await
      // fs.copy(join(nextPath, 'bundles', 'pages'), join(exportPath, nextConfig.assetPrefix, '_next', ''+buildId, 'page')) // await
    })

    // build all the pages
    Promise.all(filteredPages.map((page) => {
      const pathname = toRoute(pageDir, page)
      const pageName = getPageName(pageDir, page)
      const Component = require(page).default
      const query = {}
      const fixedPathname = fixWindowsPaths(pathname)
      const ctx = { pathname, query }
      const bundlePath = join(nextPath, 'bundles', 'pages', pageName)

      const newPathname = pathname === '/' ? '/index' : pathname
      // console.log(pathname,pageName, page);
      loadGetStaticInitialProps(Component, ctx).then((componentProps) => {
        const app = createElement(App, {
          Component,
          props: componentProps,
          router: new Router(pathname, query)
        })

        const renderPage = () => {
          let html
          let errorHtml
          let head
          try {
            html = renderToString(app)
            errorHtml = renderToString(createElement(errorComponent))
          } finally {
            head = Head.rewind() || defaultHead()
          }

          return { html, head, errorHtml }
        }

        console.log(pathname, pageName);
        // console.log(pa);
        // buildStats[pageName] = {
        //   hash: buildId
        // }


        loadGetStaticInitialProps(Document, Object.assign(ctx, { renderPage })).then((docProps) => {
          const doc = createElement(Document, Object.assign({
            __NEXT_DATA__: {
              assetPrefix: nextConfig.assetPrefix,
              component: app,
              errorComponent: createElement(errorComponent),
              props: componentProps,
              pathname: pathname,
              query,

              buildId,
              // buildStats,
              exported: true,
            },
            dev,
            staticMarkup
          }, docProps))

          const html = '<!DOCTYPE html>' + renderToString(doc)

          // console.log(html);
          // write files
          const htmlPath = join(exportPath, nextConfig.assetPrefix, pathname) // pathname)
          mkdir(htmlPath, (err, d) => {
            fs.writeFile(join(htmlPath, 'index.html'), html)
          })
        })

      })
    }))

  })

   // copy over the static/
  fs.copy(join(dir, 'static'), join(exportPath, nextConfig.assetPrefix, 'static'))
}

// Turn the path into a route
//
// e.g.
//  - index.js        => /
//  - about.js        => /about
//  - movies/index.js => /movies
function toRoute (pageDir, entry) {
  const page = '/' + fixWindowsPaths(relative(pageDir, entry))
  let base = page.split(extname(page)).join('')
  if (base[0] === '/') {
    base = base.substring(1)
  }
  console.log(page, base, entry,pageDir);
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
  const page = '/' + fixWindowsPaths(relative(pageDir, entry))
  let base = page.split(extname(page)).join('')
  if (base[0] === '/') {
    base = base.substring(1)
  }
  console.log(page, base, entry);
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

function fixWindowsPaths(path) {
  return path.split('\\').join('/')
}
