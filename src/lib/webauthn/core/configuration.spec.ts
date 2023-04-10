
import { Environment, Initializer } from './configuration'

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

        await Initializer.initialize('a6749d56-5d88-43ef-8d6c-bb96df1021a9')
      })

      it('resolves a valid login endpoint', () => {
        expect(Initializer.loginsEndpoint).toBe('https://authcloud.trusona.net/api/logins')
      })

      describe('when UAT is initialized', () => {
        beforeEach(async () => {
          await Initializer.initialize('a6749d56-5d88-43ef-8d6c-bb96df1021a9', Environment.UAT)
        })

        it('resolves a valid UAT login endpoint', () => {
          expect(Initializer.loginsEndpoint).toBe('https://authcloud.staging.trusona.net/api/logins')
        })
      })

      it('resolves a valid assertion options endpoint', () => {
        expect(Initializer.assertionOptionsEndpoint).toBe('https://authcloud.trusona.net/fido2/assertion/options')
      })

      it('resolves a valid attestation options endpoint', () => {
        expect(Initializer.attestationOptionsEndpoint).toBe('https://authcloud.trusona.net/fido2/attestation/options')
      })

      it('resolves a valid credentials endpoint', () => {
        expect(Initializer.credentialsEndpoint).toBe('https://authcloud.trusona.net/api/credentials')
      })

      it('resolves a valid enrollments endpoint', () => {
        expect(Initializer.enrollmentsEndpoint).toBe('https://authcloud.trusona.net/api/enrollments')
      })

      it('resolves a valid JWKS endpoint', () => {
        expect(Initializer.jwksEndpoint).toBe('https://authcloud.trusona.net/.well-known/jwks')
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
