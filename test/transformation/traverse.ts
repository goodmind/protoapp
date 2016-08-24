import * as test from 'tape'
import { AST, default as traverse } from '../../src/transformation/traverse'

let ast = JSON.parse(JSON.stringify({
  "package": null,
  "messages": [
    {
      "name": "google",
      "fields": [],
      "messages": [
        {
          "name": "api",
          "fields": [],
          "options": {
            "java_multiple_files": true,
            "java_outer_classname": "AnnotationsProto",
            "java_package": "com.google.api"
          },
          "messages": [
            {
              "name": "HttpRule",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "get",
                  "id": 2,
                  "oneof": "pattern"
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "put",
                  "id": 3,
                  "oneof": "pattern"
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "post",
                  "id": 4,
                  "oneof": "pattern"
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "delete",
                  "id": 5,
                  "oneof": "pattern"
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "patch",
                  "id": 6,
                  "oneof": "pattern"
                },
                {
                  "rule": "optional",
                  "type": "CustomHttpPattern",
                  "name": "custom",
                  "id": 8,
                  "oneof": "pattern"
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "body",
                  "id": 7
                },
                {
                  "rule": "repeated",
                  "type": "HttpRule",
                  "name": "additional_bindings",
                  "id": 11
                }
              ],
              "oneofs": {
                "pattern": [
                  2,
                  3,
                  4,
                  5,
                  6,
                  8
                ]
              }
            },
            {
              "name": "CustomHttpPattern",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "kind",
                  "id": 1
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "path",
                  "id": 2
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "rifl",
      "fields": [],
      "messages": [
        {
          "name": "Note",
          "fields": [
            {
              "rule": "optional",
              "type": "string",
              "name": "id",
              "id": 1
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "text",
              "id": 2
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "auto_destroy",
              "id": 3
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "password",
              "id": 4
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "key",
              "id": 5
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "timestamp",
              "id": 6
            }
          ]
        },
        {
          "name": "CreateNoteRequest",
          "fields": [
            {
              "rule": "optional",
              "type": "Note",
              "name": "note",
              "id": 1
            }
          ]
        },
        {
          "name": "GetNoteRequest",
          "fields": [
            {
              "rule": "optional",
              "type": "Note",
              "name": "note",
              "id": 1
            }
          ]
        }
      ],
      "services": [
        {
          "name": "Notes",
          "options": {},
          "rpc": {
            "CreateNote": {
              "request": "CreateNoteRequest",
              "response": "Note",
              "options": {
                "(google.api.http).post": "/v1/notes",
                "(google.api.http).body": "note",
                "(component).name": "Notes"
              }
            },
            "GetNote": {
              "request": "GetNoteRequest",
              "response": "Note",
              "options": {
                "(google.api.http).post": "/v1/notes/{id}/decrypt",
                "(google.api.http).body": "note",
                "(component).name": "Note"
              }
            }
          }
        }
      ]
    }
  ]
}))

let defaultVisitor = {
  Service (node: any) { return node.name },
  Message (node: any) { return node.name }
}

test('traverse', t => {
  let acc: AST = {
    namespaces: [],
    body: []
  }

  let resultAST = {
    namespaces: [ 'rifl' ],
    body:
      [ 'HttpRule',
        'CustomHttpPattern',
        'Notes',
        'Note',
        'CreateNoteRequest',
        'GetNoteRequest' ]
  }

  let result = traverse(acc, ast, defaultVisitor)

  t.deepEqual(acc, resultAST, 'generated ast should be same')
  t.end()
})