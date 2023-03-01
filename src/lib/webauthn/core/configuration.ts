
export interface Configuration {
  tenantUrl: string
  clientId: string

  // more urls
}

export class Initializer {
  private static config: Configuration

  static initialize (tenantUrl: string) {
    // make requests to well known for other URLs, plus client ID
    // does a bunch of things and sets configuration

    //

    this.config = { tenantUrl: '', clientId: '' }
  }

  static get configuration (): Configuration {
    return this.config
  }
}
