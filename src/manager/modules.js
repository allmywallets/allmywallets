import Vue from 'vue'
import router from '../router'
import Configurator from './configuration'

const sanitizeRoutes = (moduleId, routes) => {
  const sanitizedRoutes = []

  // todo: rename router to routing
  for (const route of routes) {
    route.router.path = `/${moduleId}${route.router.path}`
    route.router.name = `${moduleId}-${route.router.name}`

    sanitizedRoutes.push(route)
  }

  return sanitizedRoutes
}

export const loadModules = async () => {
  const config = await Configurator.getConfig()
  const modules = []

  for (const moduleConfig of config.profiles[0].application.modules) {
    const moduleCode = await fetch(`https://raw.githubusercontent.com${moduleConfig.repository}/master/dist/module.js`).then(res => res.text())
    /* eslint-disable no-new-func */
    const module = new Function('Vue', `${moduleCode};return Module;`)(Vue).instance
    // Todo: cache module

    const routes = sanitizeRoutes(module.name(), module.routes())

    modules.push({
      name: module.name(),
      routes: routes
    })

    routes.map(route => router.addRoute(route.router))
  }

  return modules
}
