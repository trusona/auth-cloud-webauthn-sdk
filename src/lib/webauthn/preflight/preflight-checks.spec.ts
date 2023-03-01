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
    test.each`
    mediation | authenticator |expected
    ${true}   | ${true}       |${true}
    ${false}  | ${true}       |${false}
    ${true}   | ${false}      |${false}
    ${false}  | ${false}      |${false}
    `
    ('returns $expected when conditional mediation is $mediation and a platform authenticator is $authenticator', async ({ mediation, authenticator, expected }) => {
      spy.mockImplementation(() => ({
        PublicKeyCredential: {
          isConditionalMediationAvailable: async () => { return await Promise.resolve(mediation) },
          isUserVerifyingPlatformAuthenticatorAvailable: async () => { return await Promise.resolve(authenticator) }
        }
      }))

      expect(await preflightChecks.isSupported()).toBe(expected)
    })
  })
})
