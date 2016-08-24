import * as test from 'tape'
import { generateImportsMessage, generateImportsService } from '../../src/helpers/generateImports'

let primitiveTypes = [
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

test('generateImports', t => {
  t.test('generateImportsMessage', t => {
    let message = {
      name: "GetNoteRequest",
      fields: [
        {
          rule: "optional",
          type: "Note",
          name: "note",
          id: 1
        }
      ]
    }

    let result = generateImportsMessage(message, primitiveTypes)

    t.ok(result[0] === 'Note', 'Note should be imported')
    t.end()
  })

  t.test('generateImportsService', t => {
    let service = {
      name: "Notes",
      options: {},
      rpc: {
        CreateNote: {
          request: "CreateNoteRequest",
          response: "Note",
          options: {
            "(google.api.http).post": "/v1/notes",
            "(google.api.http).body": "note",
            "(component).name": "Notes"
          }
        },
        GetNote: {
          request: "GetNoteRequest",
          response: "Note",
          options: {
            "(google.api.http).post": "/v1/notes/{id}/decrypt",
            "(google.api.http).body": "note",
            "(component).name": "Note"
          }
        }
      }
    }

    let result = generateImportsService(service, primitiveTypes)

    t.ok(result[0] === 'CreateNoteRequest', 'CreateNoteRequest should be imported')
    t.ok(result[1] === 'Note', 'Note should be imported')
    t.ok(result[2] === 'GetNoteRequest', 'GetNoteRequest should be imported')
    t.end()
  })

  t.end()
})