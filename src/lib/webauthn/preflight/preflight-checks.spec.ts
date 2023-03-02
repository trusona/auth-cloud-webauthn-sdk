/**
 * @jest-environment jsdom
 */
import { DefaultPreflightChecks } from './preflight-checks'

describe('DefaultPreflightChecks', () => {
  let preflightChecks: DefaultPreflightChecks
  let spy: any

  beforeEach(() => {
    preflightChecks = new DefaultPreflightChecks()
    spy = jest.spyOn(window, 'window', 'get')
  })

  it('should be created', () => {
    expect(preflightChecks).toBeTruthy()
  })

  describe('#isSupported', () => {
    const data: Array<Array<string | boolean>> = [
      [true, 'available', 'available'],
      [false, 'not available', 'available'],
      [false, 'available', 'not available'],
      [false, 'not available', 'not available']
    ]

    test.each(data)('returns %s when conditional mediation is %s and a platform authenticator is %s', async (expected, mediation, authenticator) => {
      spy.mockImplementation(() => ({
        PublicKeyCredential: {
          isConditionalMediationAvailable: async () => { return await Promise.resolve(mediation === 'available') },
          isUserVerifyingPlatformAuthenticatorAvailable: async () => { return await Promise.resolve(authenticator === 'available') }
        }
      }))

      expect(await preflightChecks.isSupported()).toBe(expected)
    })
  })
})
