import Harvest from 'harvest'

import { ensureConfig } from './config'

// singleton to avoid multiple processing.
let api

export const authenticate = async () => {
  if (api) return api

  const { access } = await ensureConfig()

  api = generateClient(access)

  return api
}

export const generateClient = ({ subdomain, accessToken, accountId }) =>
  new Harvest({
    subdomain,
    userAgent: 'Harvest CLI',
    concurrency: 1,
    auth: {
      accessToken,
      accountId
    }
  })
