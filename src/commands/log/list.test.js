import nock from 'nock'
import cli from 'cli-ux'

import LogListCommand from './list'

import { createConfigFile } from '../../../tests/utils'
import { timeEntriesResponse } from '../../mocks/time-entries'

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

jest.mock('~lib/config.js', () => {
  const { getConfig, ...rest } = jest.requireActual('../../lib/config.js')

  return {
    ...rest,
    getConfig: jest.fn(getConfig)
  }
})

const config = {
  access: {
    subdomain: 'mocked-subdomain',
    accountId: 'mocked-account-id',
    accessToken: 'mocked-access-token'
  },
  user: { id: 1, first_name: 'Mocked' }
}

nock.disableNetConnect()

describe('commands/log/list', () => {
  afterEach(jest.clearAllMocks)
  beforeAll(() => createConfigFile(config))

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
