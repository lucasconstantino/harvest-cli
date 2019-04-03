import { homedir } from 'os'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

import logger from './logger'

const log = logger.scope('Config')

const PATH_TO_CONFIG = process.env.PATH_TO_CONFIG
  ? resolve(process.cwd(), process.env.PATH_TO_CONFIG)
  : resolve(homedir(), './.harvest-cli.json')

// singleton to void multiple runs to the file-system.
let CONFIG = null

export const getConfig = () => {
  if (!CONFIG) {
    try {
      CONFIG = require(PATH_TO_CONFIG)
    } catch (err) {
      // probably file not found, ignore...
    }
  }

  return CONFIG
}

export const saveConfig = newConfig => {
  CONFIG = newConfig

  try {
    writeFileSync(PATH_TO_CONFIG, JSON.stringify(CONFIG))
    return true
  } catch (err) {
    log.error(err)
    return false
  }
}
