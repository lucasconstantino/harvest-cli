import { readFile, writeFile } from 'fs'
import { spawn } from 'child_process'
import exec from 'shell-exec'
import tmp from 'tmp'

export const getEditor = async () => {
  if (process.env.EDITOR) return process.env.EDITOR

  try {
    return (await exec('git config -l')).stdout.match(/core\.editor=(.+)/)[1]
  } catch (err) {
    // never mind, ignore it.
  }

  // fallback to vi
  return 'vi'
}

/**
 * Node editor based text editing.
 */
export const edit = async notes => {
  const editor = await getEditor()

  return new Promise((resolve, reject) => {
    tmp.file((err, path, fd, cleanup) => {
      if (err) return reject(err)

      writeFile(path, notes, err => {
        if (err) return reject(err)

        spawn(editor, [path], { stdio: 'inherit' }).on('exit', (e, code) => {
          readFile(path, 'utf-8', (err, buf) => {
            if (err) return reject(err)

            const result = buf.toString()

            cleanup()

            resolve(result)
          })
        })
      })
    })
  })
}
