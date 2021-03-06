import Harvest from 'harvest'
import nock from 'nock'
import cli from 'cli-ux'

import { createConfigFile } from '../../../tests/utils'
import { prompt } from '~lib/prompt'
import LogCreateCommand, { __get__ } from './index'

import { projectAssignmentsResponse } from '../../mocks/project-assignments'

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

const config = {
  access: {
    subdomain: 'mocked-subdomain',
    accountId: 'mocked-account-id',
    accessToken: 'mocked-access-token'
  },
  user: { id: 1, first_name: 'Mocked' }
}

const projectToChoice = __get__('projectToChoice')
const taskToChoice = __get__('taskToChoice')

nock.disableNetConnect()

describe('commands/log', () => {
  afterEach(jest.clearAllMocks)
  beforeAll(() => createConfigFile(config))

  describe('projectToChoice', () => {
    it('should transform from project object to prompt choice', () => {
      const project = { project: { name: 'Project' } }

      expect(projectToChoice(project)).toEqual({
        name: project,
        message: 'Project'
      })
    })
  })

  describe('taskToChoice', () => {
    it('should transform from task object to prompt choice', () => {
      const task = { task: { name: 'Task' } }
      expect(taskToChoice(task)).toEqual({ name: task, message: 'Task' })
    })
  })

  describe('::run', () => {
    it('should log an entry', async () => {
      const project = projectAssignmentsResponse.project_assignments[0]
      const task = project.task_assignments[0]

      prompt.mockReturnValueOnce({ project, task, hours: 3, notes: 'A note' })

      nock('https://api.harvestapp.com/v2')
        .get('/users/me/project_assignments')
        .reply(200, projectAssignmentsResponse)
        .post('/time_entries')
        .reply(200, {})

      const command = new LogCreateCommand([], {})

      await command.init()
      await command.run()

      expect(command.harvest).toBeInstanceOf(Harvest)
      // expect(prompt).toHaveBeenCalledTimes(2)

      expect(cli.action.start).toHaveBeenCalledWith(
        'Loading your projects and tasks'
      )
      expect(cli.action.stop).toHaveBeenCalledWith('done!')

      expect(cli.action.start).toHaveBeenCalledWith('Logging entry')
      expect(cli.action.stop).toHaveBeenCalledWith('there it goes!')
    })

    it('should exit when too many houts', async () => {
      const project = projectAssignmentsResponse.project_assignments[0]
      const task = project.task_assignments[0]

      prompt
        .mockReturnValueOnce({ project, task, hours: 10, notes: 'A note' })
        .mockReturnValueOnce({ confirm: false })

      nock('https://api.harvestapp.com/v2')
        .get('/users/me/project_assignments')
        .reply(200, projectAssignmentsResponse)

      const command = new LogCreateCommand([], {})

      await command.init()

      try {
        await command.run()
      } catch (err) {
        expect(err.message).toBe('EEXIT: 0')
      }

      expect(command.harvest).toBeInstanceOf(Harvest)
      // expect(prompt).toHaveBeenCalledTimes(2)

      expect(cli.action.start).toHaveBeenCalledWith(
        'Loading your projects and tasks'
      )
      expect(cli.action.stop).toHaveBeenCalledWith('done!')
    })
  })
})
