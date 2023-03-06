/**
 * @jest-environment jsdom
 */
import { PreflightChecks } from '../preflight/preflight-checks'
import { WebAuthnAuthentication } from './authentication'
import { Initializer } from './configuration'

describe('WebAuthnAuthentication', () => {
  let authentication: WebAuthnAuthentication
  let preflightChecks: PreflightChecks
  let abortSignal: AbortSignal

  describe('#authenticate', () => {
    afterAll(() => {
      jest.clearAllMocks()
      jest.resetAllMocks()
    })

    describe('when initialization has not yet occurred', () => {
      beforeEach(() => {
        authentication = new WebAuthnAuthentication()
        abortSignal = new AbortController().signal
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate('test', abortSignal)).rejects.toThrowError('The SDK is not yet initialized')
      })
    })

    describe('when the browser is not supported', () => {
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        preflightChecks = { isSupported: jest.fn().mockReturnValue(Promise.resolve(false)) }
        authentication = new WebAuthnAuthentication(preflightChecks)
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate('test', abortSignal)).rejects.toThrowError('This browser is not supported')
      })
    })

    describe('when a blank user-identifier is provided', () => {
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        preflightChecks = { isSupported: jest.fn().mockReturnValue(Promise.resolve(true)) }
        authentication = new WebAuthnAuthentication(preflightChecks)
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate('    ', abortSignal)).rejects.toThrowError('Blank user identifier was provided')
      })
    })

    describe('when fetching the challenge fails', () => {
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        preflightChecks = { isSupported: jest.fn().mockReturnValue(Promise.resolve(true)) }
        authentication = new WebAuthnAuthentication(preflightChecks)

        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            status: 404,
            json: jest.fn().mockReturnValue({}),
            ok: true
          }))
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate('user', abortSignal)).rejects.toThrowError('Failed to obtain challenge')
      })
    })

    describe('when fetching the challenge succeeds', () => {
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        preflightChecks = { isSupported: jest.fn().mockReturnValue(Promise.resolve(true)) }
        authentication = new WebAuthnAuthentication(preflightChecks)

        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            status: 202,
            json: jest.fn().mockReturnValue({ login_challenge: '86628adf-63cb-473e-bafc-c4b6fa3f3941' }),
            ok: true
          }))
      })

      it('does not return a rejection', async () => {
        await expect(authentication.authenticate('user', abortSignal)).rejects.not.toThrowError('Failed to obtain challenge')
      })
    })
  })
})
