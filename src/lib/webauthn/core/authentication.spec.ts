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
  })
})
