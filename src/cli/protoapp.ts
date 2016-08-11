import { generateService } from '../blueprints/service'
import { generateInterface } from '../blueprints/interface'
import { ProtobufRoot, ProtobufMessage, ProtobufNode } from '../interfaces'

import * as path from 'path'
import * as fs from 'fs'

function writeFile (filename: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, 'UTF-8', (err) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

interface AST {
  namespaces: string[]
  body: Promise<string>[]
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

function codeGenerator (newAst: AST): Promise<any> {
  return Promise.all(newAst.body)
}

function compiler (ast: ProtobufRoot): Promise<any> {
  let newAst: AST = transformer(ast)
  let output = codeGenerator(newAst)

  return output
}

export function main (argv: any) {
  let ast: ProtobufRoot
  try {
    ast = JSON.parse(fs.readFileSync(argv.file).toString())
  } catch (e) {
    throw 'Invalid file'
  }

  compiler(ast)
    .then((x: any[]) =>
      x.map(v =>
        writeFile(path.join(__dirname, '../../dist', v.filename), v.body)))
    .then((x: Promise<string>[]) => Promise.all(x))
    .then((x: string[]) => x.forEach(x => console.log(x)))
}
