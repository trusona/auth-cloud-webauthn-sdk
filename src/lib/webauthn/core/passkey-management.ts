import { Initializer } from './configuration'

export interface PassKey {
  id: string
  expires?: string
  created: string
  userIdentifier: string
}

export enum CredentialFlag {
  BACKUP_STATE= 'BACKUP_STATE',
  USER_PRESENT= 'USER_PRESENT',
  USER_VERIFIED= 'USER_VERIFIED',
  EXTENSION_DATA= 'EXTENSION_DATA',
  BACKUP_ELIGIBILITY= 'BACKUP_ELIGIBILITY'
}

export enum CredentialActivityType {
  REGISTRATION = 'REGISTRATION',
  ASSERTION = 'ASSERTION',
  AUTO_EXPIRATION = 'AUTO_EXPIRATION',
  MANUAL_EXPIRATION = 'MANUAL_EXPIRATION'
}

export interface PassKeyActivity {
  credentialActivityType: CredentialActivityType
  credentialId: string
  userIdentifier: string
  userAgent: string
  ipAddress: string
  operatingSystem: string
  createdAt: Date
  credentialFlags:Map<CredentialFlag, boolean>
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

  /**
   * @returns If found, the passkey activity of the authenticated user - grouped by the passkey ID.
   *
   */
  passkeyActivity: () => Promise<Map<string, PassKeyActivity[]>>

  /**
   * @returns If found, a list of the recent passkey activity of the authenticated user.
   *
   */
  latestPasskeyActivity: () => Promise<Map<string, Map<CredentialActivityType, PassKeyActivity>>>
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

  async passkeyActivity (): Promise<Map<string, PassKeyActivity[]>> {
    const url = `${Initializer.credentialsActivityEndpoint}`
    const response = await fetch(url, this.httpOptions('GET'))
    const body = response.ok ? await response.json() : undefined

    return response.ok
      ? await Promise.resolve(body)
      : await Promise.reject(new Error('Request failed. Is the provided authentication valid?'))
  }

  async latestPasskeyActivity (): Promise<Map<string, Map<CredentialActivityType, PassKeyActivity>>> {
    const url = `${Initializer.credentialsActivityEndpoint}/latest`
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
        'X-Tenant': Initializer.configuration?.origin ?? '',
        Authorization: `SDK-Bearer ${this.accessToken}`
      }
    }
  }
}
