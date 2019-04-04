/* eslint-disable camelcase */
import Harvest from 'harvest'
import nock from 'nock'
import cli from 'cli-ux'

import { createConfigFile } from '../../../tests/utils'
import { prompt } from '~lib/prompt'
import LogGitCommand from './git'

import { projectAssignmentsResponse } from './mocks/project-assignments'

jest.mock('cli-ux', () => ({
  action: {
    start: jest.fn(),
    stop: jest.fn()
  }
}))

jest.mock('~lib/logger.js', () => {
  const logger = {
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    scope: jest.fn(() => logger)
  }

  return logger
})

jest.mock('~lib/prompt.js', () => ({
  prompt: jest.fn(),
  validator: jest.fn()
}))

jest.mock('~lib/config.js', () => {
  const { getConfig, ...rest } = jest.requireActual('../../lib/config.js')

  return {
    ...rest,
    getConfig: jest.fn(getConfig)
  }
})

jest.mock('~lib/editor', () => ({
  edit: jest.fn(text => text)
}))

jest.mock('simple-git/promise', () => path => ({
  log: () => ({ all: [{ message: 'first' }, { message: 'second' }] })
}))

const config = {
  access: {
    subdomain: 'mocked-subdomain',
    accountId: 'mocked-account-id',
    accessToken: 'mocked-access-token'
  },
  user: { id: 1, first_name: 'Mocked' }
}

nock.disableNetConnect()

describe('commands/git', () => {
  afterEach(jest.clearAllMocks)
  beforeAll(() => createConfigFile(config))

  describe('::run', () => {
    it('should log an entry based on git commit history', async () => {
      const project = projectAssignmentsResponse.project_assignments[0]
      const task = project.task_assignments[0]

      prompt.mockReturnValueOnce({ project, task, hours: 3 })

      nock('https://api.harvestapp.com/v2')
        .get('/users/me/project_assignments')
        .reply(200, projectAssignmentsResponse)
        .post(
          '/time_entries',
          ({ hours, project_id, task_id, notes }) =>
            hours === 3 &&
            project_id === project.project.id &&
            task_id === task.task.id &&
            notes === 'first\nsecond'
        )
        .reply(200, {})

      const command = new LogGitCommand([], {})

      await command.init()
      await command.run()

      expect(command.harvest).toBeInstanceOf(Harvest)
      expect(prompt).toHaveBeenCalledTimes(1)

      expect(cli.action.start).toHaveBeenCalledWith(
        'Loading your projects and tasks'
      )
      expect(cli.action.stop).toHaveBeenCalledWith('done!')

      expect(cli.action.start).toHaveBeenCalledWith('Logging entry')
      expect(cli.action.stop).toHaveBeenCalledWith('there it goes!')
    })
  })
})
