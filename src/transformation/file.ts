import { ProtobufRoot } from '../interfaces'

import { primitiveTypes, dustTemplate } from './templater'
import { generateImportsMessage, generateImportsService } from '../helpers/generateImports'
import { AST, default as traverse } from './traverse'
import { normalisePlugin } from './plugin'

let defaultVisitor = {
  Service (): void { return },
  Message (): void { return }
}

export default class File {
  ast: ProtobufRoot | AST
  pluginVisitor: any
  visitor: any

  constructor (private opts: any = {}) {
    this.opts.plugin = normalisePlugin(this.opts.plugin, this.opts.dirname, {
      dirname: this.opts.dirname,
      primitiveTypes,
      generateImportsMessage,
      generateImportsService,
      dustTemplate
    }) || { visitor: this.opts.visitor }

    this.pluginVisitor = this.opts.plugin.visitor
    this.visitor = this.pluginVisitor || defaultVisitor
  }

  addAst (ast: ProtobufRoot) {
    this.ast = ast
  }

  transform<T> (): Promise<T[]> {
    let acc: AST = {
      namespaces: [],
      body: []
    }

    traverse(acc, (this.ast as ProtobufRoot), this.visitor)
    this.ast = acc

    return this.generate<T>()
  }

  generate<T> (): Promise<T[]> {
    return Promise.all((this.ast as AST).body)
  }
}
