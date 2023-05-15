/**
 * @jest-environment jsdom
 */
import { Initializer } from './configuration'
import { DefaultPassKeyManagement, PassKeyManagement } from './passkey'

describe('PassKeyManagement', () => {
  let passKeyManagement: PassKeyManagement

  function fetchStub (data: any) {
    return async function stub (_: any) {
      return await new Promise((resolve) => {
        resolve({
          ok: true,
          json: async () =>
            await Promise.resolve({
              data
            })
        })
      })
    }
  }

  beforeEach(async () => {
    global.fetch = jest.fn().mockImplementation(fetchStub({}))
    await Initializer.initialize('tenant-id')

    passKeyManagement = new DefaultPassKeyManagement('jwt')
  })

  describe('#get', () => {
    beforeEach(async () => {
      await passKeyManagement.get()
    })

    it('uses the JWT to invoke the credentials endpoint', () => {
      const url = `${Initializer.credentialsEndpoint}`

      const httpOptions = {
        method: 'GET',
        headers:
            {
              'X-Tenant': 'tenant-id',
              Authorization: 'SDK-Bearer jwt'
            }
      }

      expect(fetch).toHaveBeenCalledWith(url, httpOptions)
    })
  })

  describe('#deletePasskey', () => {
    beforeEach(async () => {
      await passKeyManagement.deletePasskey('credential-id')
    })

    it('uses the JWT to invoke the credentials endpoint', () => {
      const url = `${Initializer.credentialsEndpoint}/credential-id`

      const httpOptions = {
        method: 'DELETE',
        headers:
            {
              'X-Tenant': 'tenant-id',
              Authorization: 'SDK-Bearer jwt'
            }
      }

      expect(fetch).toHaveBeenCalledWith(url, httpOptions)
    })
  })

  describe('#getPasskey', () => {
    beforeEach(async () => {
      await passKeyManagement.getPasskey('credential-id')
    })

    it('uses the JWT to invoke the credentials endpoint', () => {
      const url = `${Initializer.credentialsEndpoint}/credential-id`

      const httpOptions = {
        method: 'GET',
        headers:
            {
              'X-Tenant': 'tenant-id',
              Authorization: 'SDK-Bearer jwt'
            }
      }

      expect(fetch).toHaveBeenCalledWith(url, httpOptions)
    })
  })
})
