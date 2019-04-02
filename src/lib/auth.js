import { homedir } from 'os'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import inquirer from 'inquirer'
import Harvest from 'harvest'

const PATH_TO_CONFIG = resolve(homedir(), './.harvest-cli.json')

let CONFIG

try {
  CONFIG = require(PATH_TO_CONFIG)
} catch (err) {
  CONFIG = null
}

export const getAccessToken = () =>
  CONFIG
    ? CONFIG.access
    : inquirer.prompt([
      { type: 'input', name: 'subdomain', message: 'Harvest subdomain' },
      { type: 'input', name: 'accountId', message: 'Account ID' },
      { type: 'input', name: 'accessToken', message: 'Your token' }
    ])

let api

export const authenticate = async () => {
  if (api) return api

  const { subdomain, accountId, accessToken } = await getAccessToken()

  api = new Harvest({
    subdomain,
    userAgent: 'Harvest CLI',
    concurrency: 1,
    auth: {
      accessToken,
      accountId
    }
  })

  if (!CONFIG) {
    try {
      await api.users.me().then(user => {
        CONFIG = { access: { subdomain, accountId, accessToken }, user }

        writeFileSync(PATH_TO_CONFIG, JSON.stringify(CONFIG))
      })
    } catch (err) {
      if (err.statusCode !== 401 || !err.error) throw err
      throw new Error(JSON.parse(err.error).error_description)
    }
  }

  return api
}
