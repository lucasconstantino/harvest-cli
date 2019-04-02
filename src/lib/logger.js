import { Signale } from 'signale'

export const logger = new Signale()

logger.config({ displayLabel: false })

export default logger
