import Harvest from 'harvest'

export const getClient = ({ subdomain, accessToken, accountId }) =>
  new Harvest({
    subdomain,
    userAgent: 'Harvest CLI',
    concurrency: 1,
    auth: {
      accessToken,
      accountId
    }
  })
