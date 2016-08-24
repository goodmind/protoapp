import * as test from 'tape'
import { convertType, firstLetterInLowerCase, hyphenCase } from '../../src/transformation/templater'

test('templater', t => {
  t.test('convertType', t => {
    t.ok('string' === convertType('string'), 'string should be string')
    t.ok('boolean' === convertType('bool'), 'bool should be boolean')
    t.ok('ByteBuffer' === convertType('bytes'), 'bytes should be ByteBuffer')
    // numbers
    t.ok('number' === convertType('double'), 'bytes should be number')
    t.ok('number' === convertType('float'), 'float should be number')
    t.ok('number' === convertType('int32'), 'int32 should be number')
    t.ok('number' === convertType('uint32'), 'uint32 should be number')
    t.ok('number' === convertType('sint32'), 'sint32 should be number')
    t.ok('number' === convertType('fixed32'), 'fixed32 should be number')
    t.ok('number' === convertType('sfixed32'), 'sfixed32 should be number')
    // TODO: should be Long
    t.ok('number' === convertType('int64'), 'int64 should be Long')
    t.ok('number' === convertType('uint64'), 'uint64 should be Long')
    t.ok('number' === convertType('sint64'), 'sint64 should be Long')
    t.ok('number' === convertType('fixed64'), 'fixed64 should be Long')
    t.ok('number' === convertType('sfixed64'), 'sfixed64 should be Long')

    t.end()
  })

  t.test('firstLetterInLowerCase', t => {
    t.ok('foo' === firstLetterInLowerCase('Foo'), 'Foo should be foo')
    t.end()
  })

  t.test('hyphenCase', t => {
    t.ok('foo-baz-bar' === hyphenCase('fooBazBar'), 'fooBazBar should be foo-baz-bar')
    t.end()
  })

  t.test('camelCase', t => {
    t.end()
  })
})