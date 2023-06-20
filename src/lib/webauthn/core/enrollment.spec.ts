/**
 * @jest-environment jsdom
 */
import { DefaultPreflightChecks } from '../preflight/preflight-checks'
import { Initializer } from './configuration'
import { Enrollment, WebAuthnEnrollment } from './enrollment'

describe('WebAuthnAuthentication', () => {
  let enrollment: Enrollment

  describe('when the browser is not supported', () => {
    beforeEach(() => {
      DefaultPreflightChecks.supported = jest.fn().mockImplementation(async () => await Promise.resolve(false))
      Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
      enrollment = new WebAuthnEnrollment()
    })

    it('returns a rejection', async () => {
      await expect(enrollment.enroll('jwt')).rejects.toThrowError('This browser is not supported')
    })
  })
})
