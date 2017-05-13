import React from 'react'
import Router from 'next/router'

export default class RouteController extends React.Component {
  componentDidMount () {
    Router.onRouteChangeStart = function(url) {
      console.log(url);
    }
    Router.onRouteChangeError  = function(url) {
      console.log(url);
    }
    Router.beforeHistoryChange  = function(url) {
      console.log(url);
    }
    //
    console.log(Router.router);
    if (Router.router && Router.router.pageLoader) {
      Router.router.pageLoader.__proto__.registerPage = function(route, regFn) {
        console.log(route, regFn);
        const register = () => {
          const { error, page } = regFn()
          this.pageCache[route] = { error, page }
          this.registerEvents.emit(route, { error, page })
        }

        // Wait for webpack to became idle if it's not.
        // More info: https://github.com/zeit/next.js/pull/1511
        if (webpackModule && webpackModule.hot && webpackModule.hot.status() !== 'idle') {
          console.log(`Waiting webpack to became "idle" to initialize the page: "${route}"`)

          const check = (status) => {
            if (status === 'idle') {
              webpackModule.hot.removeStatusHandler(check)
              register()
            }
          }
          webpackModule.hot.status(check)
        } else {
          register()
        }
      }
    }


  }

  componentWillUnmount () {
    Router.onRouteChangeStart = null
    Router.onRouteChangeError = null
    Router.beforeHistoryChange = null
  }

  render () {
    return null
  }
}
