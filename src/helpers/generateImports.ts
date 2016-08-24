import { ProtobufService, ProtobufMessage } from '../interfaces'
import { flatten2D } from './utils'

export function generateImportsMessage (model: ProtobufMessage, primitives: string[]): string[] {
  return model.fields
    .map(x => x.type)
    .filter(x => primitives.indexOf(x) < 0)
    .filter(x => x !== model.name)
}

export function generateImportsService (model: ProtobufService, primitives: string[]): string[] {
  let rpc = model.rpc
  let refs = Object.keys(rpc)
    .map(x => [rpc[x].request, rpc[x].response])

  let types = flatten2D(refs)
    .filter((x: any) => primitives.indexOf(x) < 0)
    .filter((x: any) => x !== model.name)

  return Array.from(new Set(types))
}
