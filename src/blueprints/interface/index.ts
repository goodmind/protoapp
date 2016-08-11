import dust = require('dustjs-helpers')
import { loadDustTemplate, primitiveTypes } from '..'
import { ProtobufMessage } from '../../interfaces'

function generateImports (model: ProtobufMessage, primitives: string[]) {
  return model.fields
    .map(x => x.type)
    .filter(x => primitives.indexOf(x) < 0)
    .filter(x => x !== model.name)
}

export function generateInterface (model: ProtobufMessage, namespace: string[]) {
  loadDustTemplate('interface')

  let newModel = Object.assign({}, model, {
    imports: generateImports(model, primitiveTypes)
  })

  console.log(newModel.name, newModel.imports, namespace)

  return new Promise((resolve, reject) => {
    dust.render('interface', newModel, (err, out) => {
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