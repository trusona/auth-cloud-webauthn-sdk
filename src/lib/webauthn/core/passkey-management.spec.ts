/**
 * @jest-environment jsdom
 */
import { Initializer } from './configuration'
import { DefaultPasskeyManagement, type PasskeyManagement } from './passkey-management'

describe('PasskeyManagement', () => {
  let passkeyManagement: PasskeyManagement

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

    passkeyManagement = new DefaultPasskeyManagement('jwt')
  })

  describe('#get', () => {
    beforeEach(async () => {
      await passkeyManagement.get()
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
      await passkeyManagement.deletePasskey('credential-id')
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
      await passkeyManagement.getPasskey('credential-id')
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
