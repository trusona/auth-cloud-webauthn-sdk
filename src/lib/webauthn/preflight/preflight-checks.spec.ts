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
    mediation           | authenticator       | expected
    ${'available'}      | ${'available'}      | ${true}
    ${'not available'}  | ${'available'}      | ${false}
    ${'available'}      | ${'not available'}  | ${false}
    ${'not available'}  | ${'not available'}  | ${false}
    `
    ('returns $expected when conditional mediation is $mediation and a platform authenticator is $authenticator', async ({ mediation, authenticator, expected }) => {
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
