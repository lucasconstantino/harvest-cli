import nock from 'nock'
import cli from 'cli-ux'

import LogListCommand from './list'

import { timeEntriesResponse } from './mocks/time-entries'

jest.mock('cli-ux', () => {
  const cli = {
    action: {
      start: jest.fn(),
      stop: jest.fn()
    },
    table: jest.fn()
  }

  cli.table.flags = jest.fn(() => ({}))

  return cli
})

nock.disableNetConnect()

describe('commands/log/list', () => {
  describe('::run', () => {
    it('should show time entries in a table format', async () => {
      const command = new LogListCommand([], {})

      nock('https://api.harvestapp.com/v2')
        .get('/time_entries')
        .reply(200, timeEntriesResponse)

      await command.init()
      await command.run()

      expect(cli.table).toHaveBeenCalled()
    })
  })
})
