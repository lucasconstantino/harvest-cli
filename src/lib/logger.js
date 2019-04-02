import { Signale } from 'signale'
import { arrowRight } from 'figures'

export const logger = new Signale({
  types: {
    log: {
      badge: arrowRight,
      color: 'gray',
      label: 'log',
      logLevel: 'info'
    }
  }
})

logger.config({
  displayLabel: false
})

export default logger
