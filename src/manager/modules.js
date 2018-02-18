import Vue from 'vue'
import Configurator from './configuration'

const registerRoutes = (name, routes, router) => {
  for (const entry of routes) {
    entry.router.path = '/' + name + entry.router.path
    entry.router.name = name + '-' + entry.router.name
  }

  router.addRoutes(routes.map(entry => entry.router))
}

export const loadModules = async (router) => {
  const config = await Configurator.getConfig()

  for (const moduleConfig of config.profiles[0].application.modules) {
    const moduleCode = await fetch(`https://raw.githubusercontent.com${moduleConfig.repository}/master/dist/module.js`).then(res => res.text())
    /* eslint-disable no-new-func */
    const module = new Function('Vue', `${moduleCode};return Module;`)(Vue).instance

    registerRoutes(moduleConfig.name, module.routes(), router)
  }
}
