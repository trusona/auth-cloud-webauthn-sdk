/**
 * @jest-environment jsdom
 */
import { type Enrollment, WebAuthnEnrollment } from './enrollment'
import { Initializer } from './configuration'

describe('WebAuthnEnrollment', () => {
  let enrollment: Enrollment
  let abortSignal: AbortSignal

  describe('#enroll', () => {
    describe('when the browser is not supported', () => {
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl', origin: 'sdk.example.com', useLocalStorage: true }
        Initializer.webauthnFeatures = { platformAuthenticator: false, conditionalMediation: false, webauthn: false }
        enrollment = new WebAuthnEnrollment()
      })

      it('returns a rejection', async () => {
        await expect(enrollment.enroll('token', abortSignal)).rejects.toThrowError('This browser is not supported')
      })
    })
  })
})
