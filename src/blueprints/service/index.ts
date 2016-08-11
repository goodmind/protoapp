import dust = require('dustjs-helpers')
import { loadDustTemplate, primitiveTypes } from '..'

import { ProtobufServiceRpc, ProtobufService } from '../../interfaces'

function generateRpc (model: ProtobufServiceRpc): ProtobufServiceRpc {
  let options: { [s: string]: string } = {}
  for (let opt in model.options) {
    let keys = opt.split('.'),
      key = keys[keys.length - 1]

    options[key] = model.options[opt]
  }

  return Object.assign({}, model, { options })
}

function generateImports (model: ProtobufService, primitives: string[]) {
  let rpc = model.rpc
  let refs = Object.keys(rpc)
    .map(x => [rpc[x].request, rpc[x].response])

  let types = [].concat.apply([], refs)
    .filter((x: any) => primitives.indexOf(x) < 0)
    .filter((x: any) => x !== model.name)

  return Array.from(new Set(types))
}

export function generateService (model: ProtobufService, namespace: string[]): Promise<any> {
  loadDustTemplate('service')

  let newModel = Object.assign({}, model, {
    imports: generateImports(model, primitiveTypes)
  })

  for (let m in newModel.rpc) {
    newModel.rpc[m] = generateRpc(newModel.rpc[m])
  }

  console.log(newModel.name, newModel.imports, namespace)

  return new Promise((resolve, reject) => {
    dust.render('service', newModel, (err, out) => {
      if (err != null) {
        reject(err)
      }
      else {
        resolve({
          filename: newModel.name + '.ts',
          body: out
        })
      }
    })
  })
}