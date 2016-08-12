import { generateService } from '../blueprints/service'
import { generateInterface } from '../blueprints/interface'
import { Entity, ProtobufRoot, ProtobufMessage, ProtobufNode } from '../interfaces'

import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as fs from 'fs'

function writeFile (filename: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, 'UTF-8', (err) => {
      if (err) { reject(err) } else { resolve(data) }
    })
  })
}

function createDirectory (path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err, made) => {
      if (err) { reject(err) } else { resolve(made) }
    })
  })
}

interface AST {
  namespaces: string[]
  body: Promise<Entity>[]
}

function isProtobufMessage (node: ProtobufNode): node is ProtobufMessage {
  return !!(node as ProtobufMessage).name
}

function traverser (acc: AST, node: ProtobufMessage | ProtobufRoot) {
  if (isProtobufMessage(node) && node.fields.length === 0) {
    acc.namespaces.push(node.name)
  }

  if (isProtobufMessage(node) && node._parent && 'package' in node._parent) {
    acc.namespaces = []
    acc.namespaces.push(node.name)
  }

  if (node.services) {
    for (let srv of node.services) {
      acc.body.push(generateService(srv, acc.namespaces))
    }
  }

  if (node.messages) {
    for (let msg of node.messages) {
      msg._parent = node
      if (msg.fields && msg.fields.length > 0) {
        acc.body.push(generateInterface(msg, acc.namespaces))
      }

      traverser(acc, msg)
    }
  }
}

function transformer (ast: ProtobufRoot): AST {
  let acc: AST = {
    namespaces: [],
    body: []
  }

  traverser(acc, ast)

  return acc
}

function codeGenerator (newAst: AST): Promise<Entity[]> {
  return Promise.all(newAst.body)
}

function compiler (ast: ProtobufRoot): Promise<Entity[]> {
  let newAst: AST = transformer(ast)
  let output = codeGenerator(newAst)

  return output
}

function createEntity (entity: Entity, relativeDir: string): any {
  let obj = {
    title: `installing ${entity.type}`
  }

  let files = entity.files.map(v => writeFile(path.join(relativeDir, v.filename), v.body).then(() => v))

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

  compiler(ast)
    .then((x: Entity[]) => createDirectory(relativeDir).then(() => x))
    .then((entities: Entity[]) => entities.map(v => createEntity(v, relativeDir)))
    .then((x) => Promise.all(x))
    .then(x => x.map(action => console.log(`${action.title}\n${action.files.join('')}`)))
    .catch((err) => console.error(err))
}
