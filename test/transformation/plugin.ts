import * as test from 'tape'
import { normalisePlugin } from '../../src/transformation/plugin'

test('plugin', t => {
  t.test('normalisePlugin with string plugin', t => {
    t.test('normalisePlugin with unknown plugin', t => {
      t.throws(() => {
        let result = normalisePlugin('foobar', __dirname)
      }, /Unknown plugin/)
      t.end()
    })

    /*let result = normalisePlugin('angular', __dirname)

    t.ok(typeof result.visitor.Service === 'function')
    t.ok(typeof result.visitor.Message === 'function')*/
    t.end()
  })

  t.test('normalisePlugin with obj plugin', t => {
    let plugin = { name: 'angular', visitor: {} }
    let result = normalisePlugin(plugin, __dirname)

    t.ok(plugin.name === result.name, 'plugins should be equal')
    t.end()
  })
})
