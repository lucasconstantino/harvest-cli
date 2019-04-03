import fs from 'fs'
import tmp from 'tmp'

export const createConfigFile = config => {
  // create temporary file and asign to environment variable.
  const tmpFile = (process.env.PATH_TO_CONFIG = tmp.fileSync({
    postfix: '.json'
  }).name)

  // fulfil file content with mocked config.
  fs.writeFileSync(tmpFile, JSON.stringify(config))
}
