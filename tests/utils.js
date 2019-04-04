import fs from 'fs'
import tmp from 'tmp'

import { __set__ } from '~lib/config'

export const createConfigFile = config => {
  // create temporary file and asign to environment variable.
  const tmpFile = (process.env.PATH_TO_CONFIG = tmp.fileSync({
    postfix: '.json'
  }).name)

  setConfig(config)

  // fulfil file content with mocked config.
  fs.writeFileSync(tmpFile, JSON.stringify(config))
}

export const setConfig = config => __set__('CONFIG', config)
