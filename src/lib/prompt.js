import { over, lensProp } from 'ramda'
import { prompt as enquirerPrompt } from 'enquirer'

const normalizeMessage = message =>
  typeof message === 'string' ? () => message : message

const indentMessage = message =>
  message ? (...args) => ' ' + message(...args) : message

export const validator = schema => value =>
  schema
    .validate(value)
    .then(() => true)
    .catch(err => err.message)

export const prompt = (question, ...args) => {
  // print new-line before prompts.
  console.log('')

  return enquirerPrompt(
    []
      .concat(question)
      .map(over(lensProp('message'), normalizeMessage))
      .map(over(lensProp('message'), indentMessage)),
    ...args
  )
}
