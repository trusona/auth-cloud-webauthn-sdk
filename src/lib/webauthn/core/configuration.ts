
export interface Configuration {
  tenantUrl: string
  clientId: string
  // more data ???
}

export const Initializer = {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  config: {} as Configuration | undefined,

  async initialize (tenantUrl: string): Promise<void> {
    this.config = await this.loadConfiguration(tenantUrl)

    return this.configuration !== undefined
      ? await Promise.resolve()
      : await Promise.reject(new Error('Configuration was not loaded'))
  },

  get configuration (): Configuration | undefined {
    return this.config
  },

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

  get loginsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/api/logins`
  },

  get attestationOptionsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/fido2/attestation/options`
  },

  get assertionOptionsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/fido2/assertion/options`
  },

  get credentialsEndpoint (): string {
    return `${this.configuration?.tenantUrl ?? ''}/api/credentials`
  }
}
