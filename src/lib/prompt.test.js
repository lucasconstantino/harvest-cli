import { number } from 'yup'
import {
  validator,
  prompt,
  __get__,
  __set__,
  __ResetDependency__
} from './prompt'

const normalizeMessage = __get__('normalizeMessage')
const indentMessage = __get__('indentMessage')

describe('lib/prompt', () => {
  beforeEach(jest.clearAllMocks)

  describe('normalizeMessage', () => {
    it('should ensure a message is a function', () => {
      expect(normalizeMessage('message')).toBeInstanceOf(Function)
      expect(normalizeMessage(() => 'message')).toBeInstanceOf(Function)

      expect(normalizeMessage('message')()).toBe('message')
      expect(normalizeMessage(() => 'message')()).toBe('message')
    })
  })

  describe('indentMessage', () => {
    it('should transform a message fn into an indented one', () => {
      expect(indentMessage(() => 'message')()).toBe(' message')
      expect(indentMessage(null)).toBe(null)
    })
  })

  describe('validator', () => {
    it('should generate a string returning validator', async () => {
      const schema = number()
        .min(10)
        .required()
      const validate = validator(schema)

      expect(await validate()).toBe('this is a required field')
      expect(await validate('string')).toMatch(/this must be a `number`/)
      expect(await validate(5)).toMatch(/this must be greater/)
      expect(await validate(10)).toBe(true)
    })
  })

  describe('prompt', () => {
    const enquirerPrompt = jest.fn()

    beforeEach(() => __set__('enquirerPrompt', enquirerPrompt))
    afterEach(() => __ResetDependency__('enquirerPrompt'))

    it('should normalize question messages before prompting', () => {
      prompt({
        name: 'name',
        message: 'Question'
      })

      expect(enquirerPrompt).toHaveBeenCalledTimes(1)

      // normalized message:
      expect(enquirerPrompt.mock.calls[0][0][0].message()).toBe(' Question')
    })
  })
})
