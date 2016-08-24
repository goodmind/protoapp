import { Entity, ProtobufRoot } from '../interfaces'
import { flatten2D, createDirectory, writeFile } from '../helpers/utils'
import File from '../transformation/file'

import * as path from 'path'
import * as fs from 'fs'

function flatEntities (x: any[][]): Entity[][] {
  return x.map((y: any) => flatten2D(y))
}

function createEntity (entity: Entity, relativeDir: string): any {
  let obj = {
    title: `installing ${entity.type}`
  }

  let files = entity.files
    .map(v => writeFile(path.join(relativeDir, v.filename), v.body).then(() => v))

  return Promise.all(files).then(files => {
    return Object.assign({}, obj, { files: files.map(v => `  create ${path.join(relativeDir, v.filename)}`) })
  })
}

export function main (argv: any, currentDir: string) {
  let ast: ProtobufRoot
  try {
    ast = JSON.parse(fs.readFileSync(argv.file).toString())
  } catch (e) {
    throw 'Invalid file'
  }

  let relativeDir = path.join(currentDir, argv.out)
  let file = new File({ plugin: argv.plugin, dirname: relativeDir })
  file.addAst(ast)
  file.transform<Entity[]>()
    .then(flatEntities)
    .then((x: Entity[][]) => createDirectory(relativeDir).then(() => x))
    .then((entities: Entity[][]) => flatten2D(entities).map(v => createEntity(v, relativeDir)))
    .then((x) => Promise.all(x))
    .then(x => x.map(action => console.log(`${action.title}\n${action.files.join('\n')}`)))
    .catch((err) => console.error(err))
}
