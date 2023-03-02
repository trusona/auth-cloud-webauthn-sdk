
export interface Configuration {
  tenantUrl: string
  clientId: string
  // more data ???
}

export class Initializer {
  private static config?: Configuration

  static async initialize (tenantUrl: string): Promise<void> {
    this.config = await this.loadConfiguration(tenantUrl)

    if (this.configuration === undefined) {
      throw new Error('Configuration was not loaded')
    }
  }

  static get configuration (): Configuration | undefined {
    return this.config
  }

  private static async loadConfiguration (tenantUrl: string): Promise<Configuration | undefined> {
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
  }
}
