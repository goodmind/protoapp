import {ProtobufRoot, Entity} from '../interfaces'

import { primitiveTypes, dustTemplate } from './templater'
import { generateImportsMessage, generateImportsService } from '../helpers/generateImports'
import { AST, default as traverse } from './traverse'
import { normalisePlugin } from './plugin'
import { flatten } from '../helpers/utils'

export default class File {
  ast: ProtobufRoot | AST
  pluginVisitor: any

  constructor (private opts: any = {}) {
    this.opts.plugin = normalisePlugin(this.opts.plugin, this.opts.dirname, {
      dirname: this.opts.dirname,
      primitiveTypes,
      generateImportsMessage,
      generateImportsService,
      dustTemplate
    })

    this.pluginVisitor = this.opts.plugin.visitor
  }

  addAst (ast: ProtobufRoot) {
    this.ast = ast
  }

  transform (): Promise<Entity[]> {
    let acc: AST = {
      namespaces: [],
      body: []
    }

    traverse(acc, (this.ast as ProtobufRoot), this.pluginVisitor)
    this.ast = acc

    return this.generate()
  }

  generate (): Promise<Entity[]> {
    return Promise.all((this.ast as AST).body)
      .then(x => x.map((y: any) => flatten(y)))
  }
}
