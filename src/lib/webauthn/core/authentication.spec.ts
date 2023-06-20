/**
 * @jest-environment jsdom
 */
import { DefaultPreflightChecks } from '../preflight/preflight-checks'
import { Authentication, WebAuthnAuthentication } from './authentication'
import { Initializer } from './configuration'

describe('WebAuthnAuthentication', () => {
  let authentication: Authentication
  let abortSignal: AbortSignal

  describe('#authenticate', () => {
    describe('when initialization has not yet occurred', () => {
      beforeEach(() => {
        authentication = new WebAuthnAuthentication()
        abortSignal = new AbortController().signal
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate(abortSignal)).rejects.toThrowError('The SDK is not yet initialized')
      })
    })

    describe('when the browser is not supported', () => {
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        DefaultPreflightChecks.supported = jest.fn().mockReturnValue(Promise.resolve(false))
        authentication = new WebAuthnAuthentication()
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate(abortSignal)).rejects.toThrowError('This browser is not supported')
      })
    })

    describe('when fetching the challenge fails', () => {
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        DefaultPreflightChecks.supported = jest.fn().mockReturnValue(Promise.resolve(true))
        authentication = new WebAuthnAuthentication()

        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            status: 404,
            json: jest.fn().mockReturnValue({}),
            ok: true
          }))
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate(abortSignal)).rejects.toThrowError('Failed to obtain challenge')
      })
    })

    describe('when fetching the challenge succeeds', () => {
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        DefaultPreflightChecks.supported = jest.fn().mockReturnValue(Promise.resolve(true))
        authentication = new WebAuthnAuthentication()

        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            status: 202,
            json: jest.fn().mockReturnValue({ login_challenge: '86628adf-63cb-473e-bafc-c4b6fa3f3941' }),
            ok: true
          }))
      })

      describe('when a username is not provided', () => {
        it('does not return a rejection', async () => {
          await expect(authentication.authenticate(abortSignal)).rejects.not.toThrowError('Failed to obtain challenge')
        })
      })

      describe('when a username is provided', () => {
        it('does not return a rejection', async () => {
          await expect(authentication.authenticate(abortSignal, 'username', false)).rejects.not.toThrowError('Failed to obtain challenge')
        })
      })
    })
  })
})
