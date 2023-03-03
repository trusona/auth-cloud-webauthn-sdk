
import { Initializer } from './configuration'

describe('Configuration', () => {
  describe('#initialize', () => {
    describe('when a valid URL is provided', () => {
      beforeEach(async () => {
        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            headers: {},
            status: 200,
            ok: true,
            json: async () => await Promise.resolve({ clientId: 'clientId' })
          }))

        await Initializer.initialize('http://localhost')
      })

      it('resolves a valid login endpoint', () => {
        expect(Initializer.loginsEndpoint).toBe('http://localhost/api/logins')
      })

      it('resolves a valid assertion options endpoint', () => {
        expect(Initializer.assertionOptionsEndpoint).toBe('http://localhost/fido2/assertion/options')
      })

      it('resolves a valid attestation options endpoint', () => {
        expect(Initializer.attestationOptionsEndpoint).toBe('http://localhost/fido2/attestation/options')
      })

      it('resolves a valid credentials endpoint', () => {
        expect(Initializer.credentialsEndpoint).toBe('http://localhost/api/credentials')
      })

      it('will initialize a valid configuration', () => {
        expect(Initializer.configuration).toBeTruthy()
      })

      it('will initialize a clientId value', () => {
        expect(Initializer.configuration?.clientId).toBe('clientId')
      })
    })

    describe('when an invalid URL is provided', () => {
      beforeEach(() => {
        // @ts-expect-error
        global.fetch = jest.fn(async () =>
          await Promise.resolve({
            headers: {},
            status: 404,
            ok: false
          }))
      })

      it('will throw an error', async () => {
        await expect(Initializer.initialize('http://localhost')).rejects.toThrowError('Configuration was not loaded')
      })
    })
  })
})
