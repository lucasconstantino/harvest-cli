import Harvest from 'harvest'
import nock from 'nock'
import cli from 'cli-ux'

import { createConfigFile } from '../../../tests/utils'
import { prompt } from '../prompt'
import { getConfig } from '../config'
import { HarvestCommand } from './command'

jest.mock('cli-ux', () => ({
  action: {
    start: jest.fn(),
    stop: jest.fn()
  }
}))

jest.mock('../logger.js', () => {
  const logger = {
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    scope: jest.fn(() => logger)
  }

  return logger
})

jest.mock('../prompt.js', () => ({
  prompt: jest.fn(),
  validator: jest.fn()
}))

jest.mock('../config.js', () => {
  const { getConfig, ...rest } = jest.requireActual('../config.js')

  return {
    ...rest,
    getConfig: jest.fn(getConfig)
  }
})

class TestCommand extends HarvestCommand {
  async run () {
    this.log('it works!')
  }

  exit (code = 0) {
    throw new Error('exit ' + code)
  }
}

const config = {
  access: {
    subdomain: 'mocked-subdomain',
    accountId: 'mocked-account-id',
    accessToken: 'mocked-access-token'
  },
  user: { id: 1, first_name: 'Mocked' }
}

nock.disableNetConnect()

describe('lig/harvest/command', () => {
  beforeEach(jest.clearAllMocks)
  beforeAll(() => createConfigFile(config))

  it('should NOT be possible to instantiate a Harvest command directly', () => {
    expect(() => new HarvestCommand()).toThrowError(
      'Cannot construct HarvestCommand instances directly'
    )
  })

  describe('::init', () => {
    it('should set harvest client', async () => {
      const command = new TestCommand({}, {})

      await command.init()

      expect(command.harvest).toBeInstanceOf(Harvest)
    })

    it('should exit when not willing to configure', async () => {
      getConfig.mockReturnValueOnce(null)
      prompt.mockReturnValueOnce({ configure: false })

      try {
        await new TestCommand({}, {}).init()
      } catch (exception) {
        expect(exception.message).toBe('exit 0')
      }

      expect(prompt).toHaveBeenCalledTimes(1)
    })

    it('should prompt for configuration', async () => {
      const access = {
        subdomain: 'mocked-subdomain',
        accountId: 'mocked-account-id',
        accessToken: 'mocked-access-token'
      }

      getConfig.mockReturnValueOnce(null).mockReturnValueOnce({ access })

      prompt
        .mockReturnValueOnce({ configure: true })
        .mockReturnValueOnce(access)

      nock('https://api.harvestapp.com/v2')
        .get('/users/me')
        .reply(200, { id: 1, first_name: 'Mocked' })

      const command = new TestCommand({}, {})
      await command.init()

      expect(command.harvest).toBeInstanceOf(Harvest)
      expect(prompt).toHaveBeenCalledTimes(2)
      expect(cli.action.start).toHaveBeenCalledWith('Authenticating at Harvest')
      expect(cli.action.stop).toHaveBeenCalledWith('ok!')
    })
  })
})
