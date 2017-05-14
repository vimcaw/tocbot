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
      Router.router.pageLoader.__proto__.normalizeRoute = function(route) {
        console.log(route);
        if (route[0] !== '/') {
          throw new Error('Route name should start with a "/"')
        }

        if (route === '/') return '/index' // route
        return route.replace(/\/$/, '')
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
