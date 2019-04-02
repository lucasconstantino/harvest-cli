/* eslint-disable camelcase */
import { flags } from '@oclif/command'
import cli from 'cli-ux'

import { HarvestCommand } from '~lib/harvest'

class LogListCommand extends HarvestCommand {
  loadTimeEntries = query => this.harvest.timeEntries.list(query)

  async run () {
    const {
      flags: { 'per-page': per_page, page, ...options }
    } = this.parse(LogListCommand)

    cli.action.start('Loading your time entries')

    const { time_entries } = await this.loadTimeEntries({ per_page, page })

    cli.action.stop('here they are!')

    this.newLine()

    cli.table(
      time_entries,
      {
        id: {},
        date: { get: ({ created_at }) => created_at },
        client: { get: ({ client: { name } }) => name },
        project: { get: ({ project: { name } }) => name },
        task: { get: ({ task: { name } }) => name },
        hours: {},
        status: {
          get: ({ is_running }) => (is_running ? 'Running' : 'Finished')
        }
      },
      options
    )

    // console.log(JSON.stringify(time_entries, null, 2))
  }
}

LogListCommand.description = `List
...
Lists time-tracking log entries
`

LogListCommand.flags = {
  ...cli.table.flags(),

  'per-page': flags.string({
    description: 'entries per page',
    default: '10'
  }),

  page: flags.string({
    description: 'page to load',
    default: '1'
  })
}

module.exports = LogListCommand
