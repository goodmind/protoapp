import dust = require('dustjs-helpers')
import * as fs from 'fs'
import * as path from 'path'

dust.config.whitespace = true

dust.filters['convertType'] = (value: string) => {
  switch (value.toLowerCase()) {
    case 'string':
      return 'string'
    case 'bool':
      return 'boolean'
    case 'bytes':
      return 'ByteBuffer'
    case 'double':
    case 'float':
    case 'int32':
    case 'uint32':
    case 'sint32':
    case 'fixed32':
    case 'sfixed32':
    case 'int64':
    case 'uint64':
    case 'sint64':
    case 'fixed64':
    case 'sfixed64':
      return 'number'
  }

  return value
}

dust.filters['firstLetterInLowerCase'] = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

export function hyphenCase (value: string) {
  return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

dust.filters['hyphenCase'] = hyphenCase

dust.filters['camelCase'] = (value: string) => {
  return value.replace(/(_[a-zA-Z])/g, (match) => match[1].toUpperCase())
}

dust.helpers['query'] = (chunk, context, bodies, params) => {
  return chunk.render(bodies.block, context.push(context.stack.head[params.key]))
}

dust.helpers['template'] = (chunk, context, bodies, {str = '', ctx = ''} = {str: '', ctx: ''}) => {
  return chunk.write(str.replace(/{/g, '${' + ctx + '.'))
}

dust.helpers['each'] = (chunk, context, bodies, params) => {
  let obj = params.key
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      chunk.render(bodies.block, context.push({
        $key: k,
        $value: obj[k]
      }))
    }
  }
}

export function loadDustTemplate (name: string, file: string = 'index', dirname: string = __dirname): void {
  let template = fs.readFileSync(path.join(dirname, name, `${file}.dust`), 'UTF8').toString()
  let compiledTemplate = dust.compile(template, file === 'index' ? name : `${name}.${file}`)

  dust.loadSource(compiledTemplate)
}

export function renderDustTemplate (name: string, model: any): Promise<any> {
  return new Promise((resolve, reject) => {
    dust.render(name, model, (err, out) => {
      if (err) {
        reject(err)
      } else {
        resolve(out)
      }
    })
  })
}

export function dustTemplate (name: string, model: any): Promise<any> {
  let names = name.split('.')
  let namespace = names[0]
  names.shift()

  let file = names.join('.')

  loadDustTemplate(namespace, file || 'index', this.dirname)
  return renderDustTemplate(name, model)
}

export const primitiveTypes: string[] = [
  'string',
  'bool',
  'bytes',
  'double',
  'float',
  'int32',
  'uint32',
  'sint32',
  'fixed32',
  'sfixed32',
  'int64',
  'uint64',
  'sint64',
  'fixed64',
  'sfixed64'
]
