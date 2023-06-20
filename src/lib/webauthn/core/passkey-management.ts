import { Initializer } from './configuration'

export interface PassKey {
  id: string
  expires?: string
  created: string
  userIdentifier: string
}

export interface PassKeyManagement {
  /**
   * @returns An array of all passkeys that are active, and not expired for the current user.
   */
  get: () => Promise<PassKey[]>

  /**
   * @param id The unique passkey ID, as provided
   *
   * @returns a Promise of true indicating the passkey was successfully deleted.
   *
   */
  deletePasskey: (id: string) => Promise<boolean>

  /**
   * @param id The unique passkey ID, as provided
   *
   * @returns If found, the passkey details are returned. Inactive, or expired
   * passkeys cannot be retrieved.
   *
   */
  getPasskey: (id: string) => Promise<PassKey>
}

export class DefaultPassKeyManagement implements PassKeyManagement {
  constructor (private readonly accessToken: string) {}

  async get (): Promise<PassKey[]> {
    const url = `${Initializer.credentialsEndpoint}`
    const response = await fetch(url, this.httpOptions('GET'))
    const body = response.ok ? await response.json() : undefined

    return response.ok
      ? await Promise.resolve(body)
      : await Promise.reject(new Error('Request failed. Is the provided authentication valid?'))
  }

  async deletePasskey (id: string): Promise<boolean> {
    const url = `${Initializer.credentialsEndpoint}/${id}`
    const response = await fetch(url, this.httpOptions('DELETE'))

    return response.ok
      ? await Promise.resolve(true)
      : await Promise.reject(new Error('deletion failed or authentication is not valid'))
  }

  async getPasskey (id: string): Promise<PassKey> {
    const url = `${Initializer.credentialsEndpoint}/${id}`
    const response = await fetch(url, this.httpOptions('GET'))
    const body = response.ok ? await response.json() : undefined

    return response.ok
      ? await Promise.resolve(body)
      : await Promise.reject(new Error('Passkey was not found or authentication is not valid'))
  }

  private httpOptions (method: string): RequestInit {
    return {
      method,
      headers:
      {
        Authorization: `SDK-Bearer ${this.accessToken}`
      }
    }
  }
}
