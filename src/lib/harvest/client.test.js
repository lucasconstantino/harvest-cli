import Harvest from 'harvest'

import { getClient } from './client'

describe('lib/harvest/client', () => {
  it('should create a new Harvest API client', () => {
    expect(getClient({})).toBeInstanceOf(Harvest)
  })
})
