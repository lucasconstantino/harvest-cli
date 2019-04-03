import fs from 'fs'
import tmp from 'tmp'

// const PATH_TO_CONFIG = (process.env.PATH_TO_CONFIG =
//   '/tmp/some/controlled/path/.harvest-cli.json')

import { createConfigFile } from '../../tests/utils'

const config = {
  access: {
    subdomain: 'mocked-subdomain',
    accountId: 'mocked-account-id',
    accessToken: 'mocked-access-token'
  },
  user: { id: 1, first_name: 'Mocked' }
}

describe('lib/config', () => {
  beforeAll(() => createConfigFile(config))
  beforeEach(jest.resetModules)

  describe('getConfig', () => {
    it('should return null when no config saved before', () => {
      jest.doMock(process.env.PATH_TO_CONFIG, () => {
        throw new Error('File not found')
      })

      const { getConfig } = require('./config')

      expect(getConfig()).toBe(null)
    })

    it('should return a previously saved config', () => {
      const { getConfig } = require('./config')

      expect(getConfig()).toBe(null)
    })
  })

  describe('saveConfig', () => {
    it('should write to file', () => {
      const { saveConfig } = require('./config')

      saveConfig({ some: 'value' })

      const content = fs.readFileSync(process.env.PATH_TO_CONFIG).toString()

      expect(content).toBe('{"some":"value"}')
    })

    it('should persist change', () => {
      const { saveConfig, getConfig } = require('./config')

      saveConfig({ some: 'value' })

      expect(getConfig()).toEqual({ some: 'value' })
    })
  })
})
