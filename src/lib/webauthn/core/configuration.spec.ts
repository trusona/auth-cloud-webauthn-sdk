
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

        await Initializer.initialize('example.com')
      })

      it('resolves a valid login endpoint', () => {
        expect(Initializer.loginsEndpoint).toBe('https://example.com/api/logins')
      })

      describe('when localhost is initialized', () => {
        beforeEach(async () => {
          await Initializer.initialize('localhost')
        })

        it('resolves a valid localhost login endpoint', () => {
          expect(Initializer.loginsEndpoint).toBe('http://localhost:8080/api/logins')
        })
      })

      it('resolves a valid assertion options endpoint', () => {
        expect(Initializer.assertionOptionsEndpoint).toBe('https://example.com/fido2/assertion/options')
      })

      it('resolves a valid attestation options endpoint', () => {
        expect(Initializer.attestationOptionsEndpoint).toBe('https://example.com/fido2/attestation/options')
      })

      it('resolves a valid credentials endpoint', () => {
        expect(Initializer.credentialsEndpoint).toBe('https://example.com/api/credentials')
      })

      it('resolves a valid enrollments endpoint', () => {
        expect(Initializer.enrollmentsEndpoint).toBe('https://example.com/api/enrollments')
      })

      it('echos back the provided JWKS endpoint', () => {
        expect(Initializer.jwksEndpoint).toBe('https://example.com/.well-known/jwks')
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
