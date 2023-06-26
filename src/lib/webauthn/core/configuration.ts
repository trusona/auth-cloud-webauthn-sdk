
export interface Configuration {
  tenantUrl: string
  origin: string
  clientId: string
}

/**
 * Initializes this SDK.
 *
 */
export const Initializer = {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  config: {} as Configuration | undefined,

  /**
   * Initializes this SDK.
   *
   * @remarks
   * This is the entry point to the SDK, called once, and as early as possible.
   *
   * @param origin - Your unique origin that Trusona shall provide to you. This identifier is not a secret.
   */
  async initialize (origin: string): Promise<void> {
    this.config = await this.loadConfiguration(origin)

    return this.configuration !== undefined
      ? await Promise.resolve()
      : await Promise.reject(new Error('Configuration was not loaded'))
  },

  /**
   * This method is not part of the public SDK.
   */
  get configuration (): Configuration | undefined {
    return this.config
  },

  /**
   * This method is not part of the public SDK.
   */
  headers (authorization: string = '') {
    return {
      'X-Tenant': this.config?.origin ?? '',
      'Content-Type': 'application/json',
      Authorization: authorization
    }
  },

  /**
   * This method is not part of the public SDK.
   */
  async loadConfiguration (origin: string): Promise<Configuration | undefined> {
    const tenantUrl = origin === 'localhost' ? 'http://localhost:8080' : `https://${origin}`
    const response = await fetch(`${tenantUrl}/configuration`,
      {
        headers: {
          'X-Tenant': origin,
          'Content-Type': 'application/json'
        }
      })

    if (response.ok) {
      const map = await response.json()

      return await Promise.resolve({
        origin,
        tenantUrl,
        clientId: map.clientId
      })
    } else {
      return await Promise.resolve(undefined)
    }
  },

  /**
   * This method is not part of the public SDK.
   */
  get loginsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/api/logins`
  },

  /**
   * This method is not part of the public SDK.
   */
  get attestationOptionsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/fido2/attestation/options`
  },

  /**
   * This method is not part of the public SDK.
   */
  get assertionOptionsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/fido2/assertion/options`
  },

  /**
   * This method is not part of the public SDK.
   */
  get credentialsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/api/credentials`
  },

  /**
   * This method is not part of the public SDK.
   */
  get enrollmentsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/api/enrollments`
  },

  /**
   * This method is part of the public SDK.
   */
  get jwksEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/.well-known/jwks`
  },

  /**
   * This method is not part of the public SDK.
   */
  get analyticsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/api/analytics`
  },

  // internal use
  get _chl (): string {
    return '_chl'
  },

  // internal use
  get _kid (): string {
    return '_kid'
  }
}
