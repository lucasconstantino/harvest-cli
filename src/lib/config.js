import { homedir } from 'os'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import inquirer from 'inquirer'
import { generateClient } from './harvest'

const PATH_TO_CONFIG = resolve(homedir(), './.harvest-cli.json')

// singleton to void multiple runs to the file-system.
let CONFIG = null

try {
  CONFIG = require(PATH_TO_CONFIG)
} catch (err) {
  // probably file not found, ignore...
}

export const getConfig = () => CONFIG

export const setConfig = newConfig => {
  CONFIG = newConfig

  try {
    writeFileSync(PATH_TO_CONFIG, JSON.stringify(CONFIG))
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export const ensureConfig = async () => {
  // early return.
  if (CONFIG) return CONFIG

  const access = await promptAccess()

  // side-effect!
  if (!setConfig({ access })) {
    throw new Error('Could not find nor create the necessary configuration')
  }

  return CONFIG
}

const promptAccess = async () => {
  const access = await inquirer.prompt([
    { type: 'input', name: 'subdomain', message: 'Harvest subdomain' },
    { type: 'input', name: 'accountId', message: 'Account ID' },
    { type: 'input', name: 'accessToken', message: 'Your token' }
  ])

  const client = generateClient(access)

  try {
    // check if we have authorization using the provided credentials.
    await client.users.me()
  } catch (err) {
    if (err.statusCode !== 401 || !err.error) throw err

    console.log(JSON.parse(err.error).error_description)
    console.log('Please, try again:')

    // prompt again.
    return promptAccess()
  }

  return access
}
