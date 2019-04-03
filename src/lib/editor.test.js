import mockedEnv from 'mocked-env'

describe('lib/editor', () => {
  beforeEach(jest.resetModules)

  describe('getEditor', () => {
    it('should return "vi" by default', async () => {
      jest.doMock('shell-exec', () => command => ({ stdout: 'empty' }))

      const { getEditor } = require('./editor')

      expect(await getEditor()).toBe('vi')
    })

    it('should return EDITOR environment variable, when available', async () => {
      const resetEnv = mockedEnv({ EDITOR: 'my-editor' })

      const { getEditor } = require('./editor')

      expect(await getEditor()).toBe('my-editor')

      resetEnv()
    })

    it('should return Git configured editor, when available', async () => {
      jest.doMock('shell-exec', () => command => ({
        stdout: 'core.editor=nano'
      }))

      const { getEditor } = require('./editor')

      expect(await getEditor()).toBe('nano')
    })
  })

  describe('edit', () => {
    const childProcess = require('child_process')
    const spawn = jest.fn((command, args, ...rest) => {
      if (command !== 'my-editor') {
        return childProcess.spawn(command, args, ...rest)
      }

      return { on: (event, callback) => callback() }
    })

    let resetEnv

    beforeAll(() => (resetEnv = mockedEnv({ EDITOR: 'my-editor' })))

    beforeEach(() =>
      jest.doMock('child_process', () => ({ ...childProcess, spawn }))
    )

    afterEach(jest.clearAllMocks)
    afterAll(() => resetEnv())

    it('should spawn editor', async () => {
      const { edit } = require('./editor')

      expect(spawn).not.toHaveBeenCalled()
      const result = await edit('some content')

      expect(spawn).toHaveBeenCalled()
      expect(result).toBe('some content')
    })
  })
})
