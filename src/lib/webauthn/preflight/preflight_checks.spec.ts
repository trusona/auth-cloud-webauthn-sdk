// import { beforeEach, describe, it, expect } from '@jest/globals'

import { DefaultPreflightChecks } from './preflight_checks'

describe('DefaultPreflightChecks', () => {
  let preflightChecks: DefaultPreflightChecks

  beforeEach(() => {
    preflightChecks = new DefaultPreflightChecks()
  })

  it('should be created', () => {
    expect(preflightChecks).toBeTruthy()
  })
})
