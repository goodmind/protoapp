import { ProtobufMessage, ProtobufNode, Entity, ProtobufRoot } from '../interfaces'

function isProtobufMessage (node: ProtobufNode): node is ProtobufMessage {
  return !!(node as ProtobufMessage).name
}

export interface AST {
  namespaces: string[]
  body: Promise<Entity>[]
}

export default function traverse (acc: AST, node: ProtobufMessage | ProtobufRoot, visitor: any) {
  if (isProtobufMessage(node) && node.fields.length === 0) {
    acc.namespaces.push(node.name)
  }

  if (isProtobufMessage(node) && node._parent && 'package' in node._parent) {
    acc.namespaces = []
    acc.namespaces.push(node.name)
  }

  if (node.services) {
    for (let srv of node.services) {
      acc.body.push(visitor.Service(srv, acc.namespaces))
    }
  }

  if (node.messages) {
    for (let msg of node.messages) {
      msg._parent = node
      if (msg.fields && msg.fields.length > 0) {
        acc.body.push(visitor.Message(msg, acc.namespaces))
      }

      traverse(acc, msg, visitor)
    }
  }
}
