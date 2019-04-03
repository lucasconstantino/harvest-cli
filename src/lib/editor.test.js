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
})
