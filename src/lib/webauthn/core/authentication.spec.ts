/**
 * @jest-environment jsdom
 */
import { PreflightChecks } from '../preflight/preflight-checks'
import { WebAuthnAuthentication } from './authentication'
import { Initializer } from './configuration'

describe('WebAuthnAuthentication', () => {
  let authentication: WebAuthnAuthentication

  describe('#authenticate', () => {
    describe('when initialization has not yet occurred', () => {
      beforeEach(() => {
        authentication = new WebAuthnAuthentication()
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate('test')).rejects.toThrowError('Initialization has not yet occurred')
      })
    })

    describe('when the browser is not supported', () => {
      let preflightChecks: PreflightChecks
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        preflightChecks = { isSupported: jest.fn().mockReturnValue(Promise.resolve(false)) }
        authentication = new WebAuthnAuthentication(preflightChecks)
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate('test')).rejects.toThrowError('This browser is not supported')
      })
    })

    describe('when a blank user-identifier is provided', () => {
      let preflightChecks: PreflightChecks
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        preflightChecks = { isSupported: jest.fn().mockReturnValue(Promise.resolve(true)) }
        authentication = new WebAuthnAuthentication(preflightChecks)
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate('    ')).rejects.toThrowError('Blank user identifier was provided')
      })
    })

    describe('when fetching the challenge fails', () => {
      let preflightChecks: PreflightChecks
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        preflightChecks = { isSupported: jest.fn().mockReturnValue(Promise.resolve(true)) }
        authentication = new WebAuthnAuthentication(preflightChecks)

        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            headers: new Headers(),
            status: 302,
            ok: true
          }))
      })

      it('returns a rejection', async () => {
        await expect(authentication.authenticate('user')).rejects.toThrowError('Failed to obtain challenge')
      })
    })

    describe('when fetching the challenge succeeds', () => {
      let preflightChecks: PreflightChecks
      beforeEach(() => {
        Initializer.config = { clientId: 'clientId', tenantUrl: 'tenantUrl' }
        preflightChecks = { isSupported: jest.fn().mockReturnValue(Promise.resolve(true)) }
        authentication = new WebAuthnAuthentication(preflightChecks)

        const headers = new Headers()
        headers.set('location', 'http://localhost?login_challenge=86628adf-63cb-473e-bafc-c4b6fa3f3941')

        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            headers,
            status: 302,
            ok: true
          }))
      })

      it('does not return a rejection', async () => {
        await expect(authentication.authenticate('user')).resolves.not.toThrow()
      })
    })
  })
})
