import * as test from 'tape'
import { flatten2D, createDirectory, writeFile } from '../../src/helpers/utils'

test('utils', t => {
  t.test('flatten 2d', t => {
    t.test('still be 2d', t => {
      let arr = [
        [ [1], [2], [3] ],
        [ [4], [5], [6] ],
        [ [7], [8], [9] ],
      ]
      let result = flatten2D(arr)

      t.ok(Array.isArray(result))
      t.ok(Array.isArray(result[0]))
      t.ok(result[0][0] === 1)
      t.ok(Array.isArray(result[1]))
      t.ok(result[1][0] === 2)
      t.ok(Array.isArray(result[2]))
      t.ok(result[2][0] === 3)
      t.ok(Array.isArray(result[3]))
      t.ok(result[3][0] === 4)
      t.ok(Array.isArray(result[4]))
      t.ok(result[4][0] === 5)
      t.ok(Array.isArray(result[5]))
      t.ok(result[5][0] === 6)
      t.ok(Array.isArray(result[6]))
      t.ok(result[6][0] === 7)
      t.ok(Array.isArray(result[7]))
      t.ok(result[7][0] === 8)
      t.ok(Array.isArray(result[8]))
      t.ok(result[8][0] === 9)
      t.end()
    })

    let arr = [
      [1], [2], [3]
    ]
    let result = flatten2D(arr)

    t.ok(Array.isArray(result))
    t.ok(result[0] === 1)
    t.ok(result[1] === 2)
    t.ok(result[2] === 3)
    t.end()
  })

  t.test('writeFile', t => {
    t.end()
  })

  t.test('createDirectory', t => {
    t.end()
  })
})