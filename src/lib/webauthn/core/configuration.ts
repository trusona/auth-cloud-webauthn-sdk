
export interface Configuration {
  tenantUrl: string
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
   * @param tenantUrl - Your tenant origin URL that Trusona shall provide to you.
   */
  async initialize (tenantUrl: string): Promise<void> {
    this.config = await this.loadConfiguration(tenantUrl)

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
  async loadConfiguration (tenantUrl: string): Promise<Configuration | undefined> {
    const response = await fetch(`${tenantUrl}/configuration`)

    if (response.ok) {
      const map = await response.json()

      return await Promise.resolve({
        clientId: map.clientId,
        tenantUrl
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

  get jwksEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/.well-known/jwks`
  }
}
