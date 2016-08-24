import { resolve } from '../helpers/resolve'

export interface PluginContext {
  dirname?: string
  generateImportsService?: Function
  generateImportsMessage?: Function
  primitiveTypes?: string[]
  dustTemplate?: Function
}

export interface PluginModule {
  __esModule: any
  default: any
}

export interface Plugin {}

function isPluginModule (plugin: PluginModule|Plugin): plugin is PluginModule {
  return (plugin as PluginModule).__esModule
}

export function normalisePlugin (
  plugin: string|PluginModule|Plugin,
  dirname: string,
  context: PluginContext = {}
): any {
  if (!plugin) {
    return null
  }

  if (typeof plugin === 'string') {
    let pluginLoc = resolve(`protoapp-plugin-${plugin}`, dirname) || resolve(plugin, dirname)
    if (pluginLoc) {
      plugin = require(pluginLoc)
    } else {
      throw new ReferenceError('Unknown plugin')
    }
  }

  plugin = isPluginModule(plugin) ? plugin.default : plugin
  plugin = typeof plugin === 'function' ? plugin(context) : plugin

  return plugin
}
