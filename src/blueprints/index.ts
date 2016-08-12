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

dust.filters['camelCase'] = (value: string) => {
  return value.replace(/(_[a-zA-Z])/g, (match) => match[1].toUpperCase())
}

dust.helpers['template'] = (chunk, context, bodies, {str = '', ctx = ''} = {str: '', ctx: ''}) => {
  console.log(context, str, ctx)
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

export function loadDustTemplate (name: string): void {
  let template = fs.readFileSync(path.join(__dirname, name, 'index.dust'), 'UTF8').toString()
  let compiledTemplate = dust.compile(template, name)

  dust.loadSource(compiledTemplate)
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
