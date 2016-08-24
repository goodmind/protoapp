import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as fs from 'fs'

export function flatten2D (arr: any[]): any[] {
  return [].concat.apply([], arr)
}

export function writeFile (filename: string, data: any): Promise<any> {
  return createDirectory(path.dirname(filename))
    .then((x: any) => new Promise((resolve, reject) => {
      fs.writeFile(filename, data, 'UTF-8', err => {
        if (err) { reject(err) } else { resolve(data) }
      })
    }))
}

export function createDirectory (path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err, made) => {
      if (err) { reject(err) } else { resolve(made) }
    })
  })
}
