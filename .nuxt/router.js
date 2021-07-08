import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4fcf7123 = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _8ae6d5d0 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _d1835360 = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _cbae5a60 = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _3c3197dc = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _44009766 = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _fe19d3c6 = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _4fcf7123,
    children: [{
      path: "",
      component: _8ae6d5d0,
      name: "home"
    }, {
      path: "/login",
      component: _d1835360,
      name: "login"
    }, {
      path: "/register",
      component: _d1835360,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _cbae5a60,
      name: "profile"
    }, {
      path: "/settings",
      component: _3c3197dc,
      name: "settings"
    }, {
      path: "/editor",
      component: _44009766,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _fe19d3c6,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
