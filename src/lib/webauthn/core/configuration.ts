
export interface Configuration {
  tenantUrl: string
  tenantId: string
  clientId: string
}

export enum Environment {
  // default (public) environment
  PRODUCTION = 'https://authcloud.trusona.net',
  // internal usage only - not for public use
  STAGING = 'https://authcloud.staging.trusona.net'
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
   * @param tenantId - Your unique tenant ID that Trusona shall provide to you. This identifier is not a secret.
   */
  async initialize (tenantId: string, environment: Environment = Environment.PRODUCTION): Promise<void> {
    this.config = await this.loadConfiguration(tenantId, environment)

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
  get headers () {
    return {
      'X-Tenant': this.config?.tenantId ?? '',
      'Content-Type': 'application/json'
    }
  },

  /**
   * This method is not part of the public SDK.
   */
  async loadConfiguration (tenantId: string, environment: Environment): Promise<Configuration | undefined> {
    const tenantUrl = environment
    const response = await fetch(`${tenantUrl}/configuration`,
      {
        headers: {
          'X-Tenant': tenantId,
          'Content-Type': 'application/json'
        }
      })

    if (response.ok) {
      const map = await response.json()

      return await Promise.resolve({
        tenantId,
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
   * This method is not part of the public SDK.
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
