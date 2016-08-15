let Module = require('module')

let relativeModules: any = {}

export function resolve (loc: string, relative: string = process.cwd()): string {
  let relativeMod = relativeModules[relative]

  if (!relativeMod) {
    relativeMod = new Module()
    relativeMod.paths = Module._nodeModulePaths(relative)
    relativeModules[relative] = relativeMod
  }

  try {
    return Module._resolveFilename(loc, relativeMod)
  } catch (err) {
    return null
  }
}
