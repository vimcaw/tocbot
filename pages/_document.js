import React from 'react'
import htmlescape from 'htmlescape'

import Document, { Head as BaseHead, Main, NextScript as BaseNextScript } from 'next/document'

function fixIndex(pathname) {
  return pathname === '/' ? '/index' : pathname
}

export default class MyDocument extends Document {
  static getStaticInitialProps () {
    return Promise.resolve(
      Document.getInitialProps.apply(Document, arguments)
    )
  }

  render () {
    return (
     <html>
       <Head>
         <style>{`body { margin: 0 } /* custom! */`}</style>
       </Head>
       <body>
         {this.props.customValue}
         <Main />
         <NextScript />
       </body>
     </html>
    )
  }
}

export class Head extends BaseHead {
  render () {
    const { head, styles, __NEXT_DATA__ } = this.context._documentProps
    const { pathname, buildId, assetPrefix, exported } = __NEXT_DATA__
    return <head>
      <link rel='preload' href={`${assetPrefix}/_next/${buildId}/page${fixIndex(pathname)}`} as='script' />
      <link rel='preload' href={`${assetPrefix}/_next/${buildId}/page/_error`} as='script' />
      {this.getPreloadMainLinks()}
      {(head || []).map((h, i) => React.cloneElement(h, { key: i }))}
      {styles || null}
      {this.props.children}
    </head>
  }
}

export class NextScript extends BaseNextScript {
  render () {
    const { staticMarkup, __NEXT_DATA__ } = this.context._documentProps
    const { pathname, buildId, assetPrefix, exported } = __NEXT_DATA__

    return <div>
      {staticMarkup ? null : <script dangerouslySetInnerHTML={{
        __html: `
          __NEXT_DATA__ = ${htmlescape(__NEXT_DATA__)}
          module={}
          __NEXT_LOADED_PAGES__ = []
          __NEXT_REGISTER_PAGE = function (route, fn) {
            __NEXT_LOADED_PAGES__.push({ route: route, fn: fn })
          }
        `
      }} />}
      <script async type='text/javascript' src={`${assetPrefix}/_next/${buildId}/page${fixIndex(pathname)}`} />
      <script async type='text/javascript' src={`${assetPrefix}/_next/${buildId}/page/_error`} />
      {staticMarkup ? null : this.getScripts()}
    </div>
  }
}
