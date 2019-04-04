import { Command } from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'
import { string } from 'yup'

import log from '../logger'
import { prompt, validator } from '../prompt'
import { getConfig, saveConfig } from '../config'
import { getClient } from './client'

const prefix = i => (i === 1 ? '\n\n' : i > 1 ? '\n' : '')

const indent = (i, text) =>
  text
    .split('\n')
    .map(line => (i > 0 ? '   ' : '') + line)
    .join('\n')

const format = (arg, i) =>
  typeof arg === 'string' ? prefix(i) + indent(i, arg) : arg

/**
 * Base Harvest connecting commands.
 */
export class HarvestCommand extends Command {
  constructor (...args) {
    if (new.target === HarvestCommand) {
      throw new TypeError('Cannot construct HarvestCommand instances directly')
    }

    super(...args)
  }

  /* eslint-disable no-sequences */
  info = (...args) => (this.newLine(), log.info(...args.map(format)))
  log = (...args) => (this.newLine(), log.log(...args.map(format)))
  error = (...args) => (this.newLine(), log.error(...args.map(format)))
  warn = (...args) => (this.newLine(), log.warn(...args.map(format)))
  /* eslint-enable no-sequences */

  newLine = () => console.log()

  async init () {
    let config = getConfig()

    if (!config) {
      this.info(
        chalk.bold(
          'You must authenticate using a Harvest Personal Access Token before continuing'
        ),
        'Make you sure you have it set-up at https://id.getharvest.com/developers.',
        'Once you are ready, we can configure the CLI to use your token.'
      )

      const { configure } = await prompt({
        type: 'confirm',
        name: 'configure',
        initial: true,
        message: 'Do you want to configure it now?'
      })

      if (!configure) {
        this.newLine()
        this.log('Ok, come back when you are ready.')
        this.exit()
      }

      config = await this.configure()
    }

    this.harvest = getClient(config.access)
  }

  configure = async () => {
    const access = await prompt([
      {
        type: 'input',
        name: 'subdomain',
        message: 'Harvest subdomain',
        validate: validator(string().required())
      },
      {
        type: 'input',
        name: 'accountId',
        message: 'Account ID',
        validate: validator(string().required())
      },
      {
        type: 'input',
        name: 'accessToken',
        message: 'Your token',
        validate: validator(string().required())
      }
    ])

    try {
      this.newLine()
      cli.action.start('Authenticating at Harvest')

      // check if we have authorization using the provided credentials.
      const user = await getClient(access).users.me()

      cli.action.stop('ok!')

      this.log(chalk.bold(`Hello, ${user.first_name}! You are connected ;)`))

      saveConfig({ access, user })
    } catch (err) /* istanbul ignore next */ {
      cli.action.stop('outch!')

      if (err.statusCode !== 401 || !err.error) {
        this.error(err.message)
        this.exit(1)
      }

      this.warn(
        chalk.bold(JSON.parse(err.error).error_description),
        'Please, try again:'
      )

      // try again.
      return this.configure()
    }

    return getConfig()
  }

  loadProjects = () =>
    this.harvest.projectAssignments
      .me()
      // eslint-disable-next-line camelcase
      .then(({ project_assignments }) => project_assignments)
}
